import { describe, expect, it } from 'vitest';
import { createSerialQueue } from './mutation-queue';

// Defer mediante microtasks (determinista, sin timers que el runner pueda retrasar
// bajo carga de workers paralelos; la cola es pura promesa y no requiere timers).
const defer = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const tick = async (): Promise<void> => {
  for (let i = 0; i < 8; i++) {
    await defer();
  }
};

describe('createSerialQueue', () => {
  it('resolves in insertion order (A → B → C)', async () => {
    const queue = createSerialQueue();
    const order: string[] = [];

    const [a, b, c] = await Promise.all([
      queue.push(async () => {
        await defer();
        order.push('A');
        return 'A';
      }),
      queue.push(async () => {
        await defer();
        order.push('B');
        return 'B';
      }),
      queue.push(async () => {
        await defer();
        order.push('C');
        return 'C';
      }),
    ]);

    expect(order).toEqual(['A', 'B', 'C']);
    expect([a, b, c]).toEqual(['A', 'B', 'C']);
  });

  it('never runs tasks concurrently, even on slow first task', async () => {
    const queue = createSerialQueue();
    let running = 0;
    let maxConcurrent = 0;
    let resolved = false;

    const task = () =>
      queue.push(async () => {
        running++;
        maxConcurrent = Math.max(maxConcurrent, running);
        await defer();
        running--;
        return true;
      });

    await Promise.all([task(), task(), task()]);
    resolved = true;
    await tick();

    expect(maxConcurrent).toBe(1);
    expect(resolved).toBe(true);
  });

  it('a rejected task does not break the chain for later tasks', async () => {
    const queue = createSerialQueue();
    const runs: string[] = [];

    const first = queue.push(async () => {
      runs.push('first');
      throw new Error('boom');
    });
    await expect(first).rejects.toThrow('boom');

    const second = queue.push(async () => {
      runs.push('second');
      return 'ok';
    });
    await expect(second).resolves.toBe('ok');

    expect(runs).toEqual(['first', 'second']);
  });

  it('a task rejected while another is pending still keeps order', async () => {
    const queue = createSerialQueue();
    const runs: string[] = [];

    const first = queue.push(async () => {
      await defer();
      runs.push('first');
      throw new Error('boom');
    });
    const second = queue.push(async () => {
      runs.push('second');
      return 'ok';
    });

    await expect(first).rejects.toThrow('boom');
    await expect(second).resolves.toBe('ok');

    expect(runs).toEqual(['first', 'second']);
  });
});