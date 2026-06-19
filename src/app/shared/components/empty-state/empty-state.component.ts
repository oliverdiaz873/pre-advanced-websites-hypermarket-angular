import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="empty-state">
      <div class="icon-wrapper">
        <ng-content select="[icon]">
          <span class="icon-string" aria-hidden="true">{{ icon }}</span>
        </ng-content>
      </div>
      <h2>{{ title }}</h2>
      @if (description || message) {
        <p>{{ description || message }}</p>
      }
      <div class="actions">
        @if (action.observed) {
          <button type="button" class="action-btn" (click)="action.emit()">
            {{ actionLabel }}
          </button>
        } @else if (actionLabel && actionUrl) {
          <a [routerLink]="actionUrl" class="action-btn">{{ actionLabel }}</a>
        }
      </div>
    </section>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      max-width: 42rem;
      margin: 0 auto;
      width: 100%;
    }

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d1d5db;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1.5rem;
    }

    .icon-string {
      font-size: 2rem;
      line-height: 1;
    }

    h2 {
      margin: 0 0 0.75rem;
      color: #030712;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.25;
    }

    p {
      max-width: 28rem;
      margin: 0 0 2rem;
      color: #525252;
      font-size: 0.875rem;
      line-height: 1.625;
    }

    .actions {
      margin-top: 0.5rem;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 2rem;
      border-radius: 9999px;
      background: #030712;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
    }

    .action-btn:hover {
      background: #1f2937;
      transform: scale(1.05);
    }

    .action-btn:active {
      transform: scale(0.95);
    }

    @media (min-width: 768px) {
      .empty-state {
        padding: 3rem;
      }

      .icon-wrapper {
        width: 5rem;
        height: 5rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      p {
        font-size: 1rem;
      }

      .action-btn {
        font-size: 1rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input() icon = '!';
  @Input() title = 'Sin resultados';
  @Input() message = 'No encontramos contenido para mostrar.';
  @Input() description?: string;
  @Input() actionLabel?: string;
  @Input() actionUrl?: string;
  @Output() action = new EventEmitter<void>();
}
