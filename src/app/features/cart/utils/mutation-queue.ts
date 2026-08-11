/**
 * Cola serializada de mutaciones (A2 §4, espejo de N2 mutation-queue).
 *
 * Garantiza que las modificaciones de cantidades se ejecuten en orden de
 * llegada (A → B → C), nunca de forma concurrente, para evitar un
 * read-modify-write destructivo contra el backend. Cada tarea se calcula en
 * tiempo de ejecución contra el último estado confiado del servidor.
 */

export interface SerialQueue {
  push<T>(task: () => Promise<T>): Promise<T>;
}

/** Crea una cola FIFO de promesas encadenadas. */
export function createSerialQueue(): SerialQueue {
  let tail: Promise<unknown> = Promise.resolve();

  return {
    push<T>(task: () => Promise<T>): Promise<T> {
      const run = tail.then(() => task(), () => task());
      // El tail engulle errores para no romper la cadena; el caller ve el resultado.
      tail = run.then(
        () => undefined,
        () => undefined,
      );
      return run;
    },
  };
}