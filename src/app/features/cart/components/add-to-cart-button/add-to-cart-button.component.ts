import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Product } from '../../../../core/types/product.interface';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.scss']
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
