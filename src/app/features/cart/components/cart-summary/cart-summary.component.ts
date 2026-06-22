import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  @Input() totalItems = 0;
  @Input() totalPrice = 0;

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }
}
