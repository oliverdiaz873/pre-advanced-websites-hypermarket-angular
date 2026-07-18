import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal('');
  readonly type = signal<ToastType>('success');
  readonly visible = signal(false);
  readonly duration = signal(4000);

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastType = 'success', duration = 4000): void {
    this.clearTimer();
    this.message.set(message);
    this.type.set(type);
    this.duration.set(duration);
    this.visible.set(true);
    if (duration > 0) {
      this.timer = setTimeout(() => this.hide(), duration);
    }
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
  warning(message: string): void { this.show(message, 'warning'); }
  info(message: string): void { this.show(message, 'info'); }

  hide(): void {
    this.clearTimer();
    this.visible.set(false);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
