import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal('');
  readonly type = signal<ToastType>('info');
  readonly visible = signal(false);

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastType = 'info'): void {
    this.clearTimer();
    this.message.set(message);
    this.type.set(type);
    this.visible.set(true);
    this.timer = setTimeout(() => this.hide(), 3000);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
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
