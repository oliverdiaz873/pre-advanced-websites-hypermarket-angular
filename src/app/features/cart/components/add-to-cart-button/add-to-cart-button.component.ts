import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Product } from '../../../../core/types/product.interface';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    @if (quantity() === 0) {
      <button
        type="button"
        class="btn-agregar"
        (click)="handleInitialAdd($event)"
        [attr.aria-label]="('common.cart.add_button' | translate) + ' ' + ('common.product.add_to_cart' | translate)"
      >
        {{ 'common.cart.add_button' | translate }}
      </button>
    } @else {
      <div class="cart-counter-container">
        <button
          type="button"
          class="counter-btn minus"
          (click)="handleDecrement($event)"
          [attr.aria-label]="'common.cart.decrease_qty' | translate"
        >-</button>
        <span class="counter-value">{{ quantity() }}</span>
        <button
          type="button"
          class="counter-btn plus"
          (click)="handleIncrement($event)"
          [attr.aria-label]="'common.cart.increase_qty' | translate"
        >+</button>
      </div>
    }
  `,
  styles: [`
    :host { display: flex; width: 100%; max-width: 120px; align-self: center; }

    .btn-agregar {
      width: 100%;
      padding: 0.5rem 0;
      background-color: #ffcc00;
      color: #000;
      font-weight: 600;
      font-size: 0.75rem;
      border-radius: 0.625rem;
      border: none;
      cursor: pointer;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      z-index: 2;
      font-family: inherit;
      line-height: inherit;
    }

    .btn-agregar:hover {
      background-color: #ff9900;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: scale(1.02);
    }

    .cart-counter-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background-color: #f3f4f6;
      border-radius: 0.625rem;
      padding: 0.25rem;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
      z-index: 2;
    }

    .counter-btn {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      font-family: inherit;
      line-height: inherit;
    }

    .counter-btn:hover {
      background-color: #ffcc00;
      color: #000;
    }

    .counter-btn.minus:hover {
      background-color: #ef4444;
      color: #fff;
    }

    .counter-btn.plus:hover {
      background-color: #10b981;
      color: #fff;
    }

    .counter-value {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111827;
      min-width: 1.5rem;
      text-align: center;
    }

    @media (min-width: 768px) {
      :host { max-width: 140px; }
      .btn-agregar { padding: 0.625rem 0; font-size: 0.875rem; }
      .counter-btn { width: 2.25rem; height: 2.25rem; }
    }
  `]
})
export class AddToCartButtonComponent {
  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);

  protected quantity = computed(() => {
    const items = this.cartService.items();
    return items.find(item => item.productId === this.product.id)?.quantity ?? 0;
  });

  protected handleInitialAdd(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addItem(this.product);
  }

  protected handleIncrement(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.updateQuantity(this.product.id, (this.quantity() + 1));
  }

  protected handleDecrement(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const newQty = this.quantity() - 1;
    if (newQty <= 0) {
      this.cartService.removeItem(this.product.id);
    } else {
      this.cartService.updateQuantity(this.product.id, newQty);
    }
  }
}
