import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quantity-controls">
      <button
        type="button"
        class="quantity-controls__btn"
        (click)="onDecrease()"
        aria-label="Disminuir cantidad"
      >
        -
      </button>
      <span class="quantity-controls__display">{{ quantity }}</span>
      <button
        type="button"
        class="quantity-controls__btn"
        (click)="onIncrease()"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  `,
  styles: [`
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .quantity-controls__btn {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      color: #111827;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 1rem;
      line-height: 1;
      padding: 0;
    }

    .quantity-controls__btn:hover {
      background-color: #e5e7eb;
      transform: scale(1.1);
    }

    .quantity-controls__btn:active {
      transform: scale(0.95);
    }

    .quantity-controls__display {
      width: 2rem;
      text-align: center;
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
      min-width: 2rem;
    }

    @media (max-width: 1024px) {
      .quantity-controls {
        gap: 0.5rem;
      }

      .quantity-controls__btn {
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class QuantityControlsComponent {
  @Input() quantity = 1;
  /** @deprecated Kept for backward compatibility — no longer displayed */
  @Input() unitLabel = 'unidad';

  @Output() quantityChange = new EventEmitter<number>();

  public onDecrease(): void {
    if (this.quantity > 1) {
      this.quantityChange.emit(this.quantity - 1);
    } else {
      this.quantityChange.emit(0);
    }
  }

  public onIncrease(): void {
    this.quantityChange.emit(this.quantity + 1);
  }
}
