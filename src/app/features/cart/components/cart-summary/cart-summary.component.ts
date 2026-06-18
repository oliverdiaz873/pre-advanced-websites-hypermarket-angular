import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  @Input() totalItems = 0;
  @Input() totalPrice = 0;

  @Output() checkout = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }

  public onCheckout(): void {
    this.checkout.emit();
  }

  public onClear(): void {
    this.clear.emit();
  }
}
