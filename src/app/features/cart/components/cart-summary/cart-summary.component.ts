import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '@features/cart/services/cart.service';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * CartSummaryComponent - Cart Summary Component
 *
 * Displays a side panel with the purchase summary including:
 * - Total items in the cart
 * - Total amount to pay
 * - Button to start the checkout process
 *
 * Integrated into the cart page as an informative aside
 * that helps users quickly see the status of their purchase.
 *
 * INTERNATIONALIZATION:
 * Supports ES/EN with translations at common.cart.summary
 */
@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  private cartService = inject(CartService);

  public totalItems = this.cartService.totalItems;
  public totalPrice = this.cartService.totalPrice;

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }
}
