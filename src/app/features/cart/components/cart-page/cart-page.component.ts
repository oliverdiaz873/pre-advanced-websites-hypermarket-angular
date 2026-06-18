import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { CartHeaderComponent } from '../cart-header/cart-header.component';
import { CartLayoutComponent } from '../cart-layout/cart-layout.component';
import { CartItemsListComponent } from '../cart-items-list/cart-items-list.component';
import { CartSummaryComponent } from '../cart-summary/cart-summary.component';
import { EmptyCartComponent } from '../empty-cart/empty-cart.component';

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
  private router = inject(Router);

  // Expose signals from CartService
  public items = this.cartService.items;
  public totalItems = this.cartService.totalItems;
  public totalPrice = this.cartService.totalPrice;

  public onUpdateQuantity(event: { productId: string, quantity: number }): void {
    this.cartService.updateQuantity(event.productId, event.quantity);
  }

  public onRemoveItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  public onClearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  public onCheckout(): void {
    alert('¡Gracias por tu compra! Tu pedido ha sido procesado con éxito.');
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }

  public onBrowseProducts(): void {
    this.router.navigate(['/']);
  }
}
