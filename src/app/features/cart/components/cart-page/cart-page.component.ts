import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '@features/cart/services/cart.service';
import { CartHeaderComponent } from '../cart-header/cart-header.component';
import { CartLayoutComponent } from '../cart-layout/cart-layout.component';
import { CartItemsListComponent } from '../cart-items-list/cart-items-list.component';
import { CartSummaryComponent } from '../cart-summary/cart-summary.component';
import { EmptyCartComponent } from '../empty-cart/empty-cart.component';

/**
 * CartPage - Cart Page Component
 *
 * Renders the main cart page view.
 * Displays the cart items list and summary,
 * or an empty cart message when there are no items.
 */
@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    CartHeaderComponent,
    CartLayoutComponent,
    CartItemsListComponent,
    CartSummaryComponent,
    EmptyCartComponent
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  private cartService = inject(CartService);

  public items = this.cartService.items;
  public totalItems = this.cartService.totalItems;

  public onUpdateQuantity(event: { productId: string, quantity: number }): void {
    this.cartService.updateQuantity(event.productId, event.quantity);
  }

  public onRemoveItem(productId: string): void {
    this.cartService.removeItem(productId);
  }
}
