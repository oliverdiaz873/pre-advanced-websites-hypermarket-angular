import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@features/cart/services/cart.service';
import { AuthService } from '@features/auth/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * CartSummaryComponent - Cart Summary Component
 *
 * Displays a side panel with the purchase summary including:
 * - Total items in the cart
 * - Total amount to pay
 * - Button to start the checkout process
 *
 * E3: el botón de checkout queda habilitado solo cuando el usuario está
 * autenticado y el carrito no está vacío (decidido en el plan E3). Lleva a
 * /checkout; la ruta está protegida con requireAuthGuard + returnUrl.
 *
 * INTERNATIONALIZATION:
 * Supports ES/EN with translations at common.cart.summary
 */
@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  private cartService = inject(CartService);
  private auth = inject(AuthService);

  public totalItems = this.cartService.totalItems;
  public totalPrice = this.cartService.totalPrice;

  /** Botón disponible solo con sesión autenticada y carrito no vacío. */
  public canCheckout = computed(() => this.auth.authenticated() && this.totalItems() > 0);

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }
}
