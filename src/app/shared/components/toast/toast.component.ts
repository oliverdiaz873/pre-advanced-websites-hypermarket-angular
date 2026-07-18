import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="toast"
         [class.toast-visible]="service.visible()"
         [class.toast-hidden]="!service.visible()"
         [class.toast-success]="service.type() === 'success'"
         [class.toast-error]="service.type() === 'error'"
         [class.toast-warning]="service.type() === 'warning'"
         [class.toast-info]="service.type() === 'info'">
      <span class="toast-message">{{ service.message() }}</span>
      @if (service.duration() === 0) {
        <button class="toast-close" (click)="service.hide()">
          <app-icon name="close" className="w-4 h-4"></app-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      transition: opacity 300ms, transform 300ms;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-16px) scale(0.95);
    }

    .toast-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .toast-success { background: #16a34a; color: #fff; }
    .toast-error   { background: #dc2626; color: #fff; }
    .toast-warning { background: #ca8a04; color: #fff; }
    .toast-info    { background: #2563eb; color: #fff; }

    .toast-message { flex: 1; }
    .toast-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 0.375rem;
      border: none;
      background: transparent;
      color: inherit;
      opacity: 0.8;
      cursor: pointer;
      transition: opacity 200ms;
    }
    .toast-close:hover { opacity: 1; }
  `]
})
export class ToastComponent {
  protected service = inject(ToastService);
}
