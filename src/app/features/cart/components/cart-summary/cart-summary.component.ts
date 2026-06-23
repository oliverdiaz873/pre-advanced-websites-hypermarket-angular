import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../core/services/cart.service';
import { TranslatePipe } from '@ngx-translate/core';

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
