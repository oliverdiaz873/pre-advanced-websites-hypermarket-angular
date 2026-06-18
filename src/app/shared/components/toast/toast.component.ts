import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (service.visible()) {
      <div class="toast" [class.toast-success]="service.type() === 'success'"
                          [class.toast-error]="service.type() === 'error'"
                          [class.toast-info]="service.type() === 'info'">
        <span class="toast-message">{{ service.message() }}</span>
        <button class="toast-close" (click)="service.hide()">
          <app-icon name="close" className="w-4 h-4"></app-icon>
        </button>
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      font-size: 0.875rem;
      font-weight: 600;
      max-width: 24rem;
      animation: toast-in 300ms ease;
    }

    .toast-success { background: #16a34a; color: #fff; }
    .toast-error   { background: #dc2626; color: #fff; }
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

    @keyframes toast-in {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  protected service = inject(ToastService);
}
