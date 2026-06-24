import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '@features/cart/types/cart.interface';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart-items-list',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart-items-list.component.html',
  styleUrl: './cart-items-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemsListComponent {
  @Input() items: CartItem[] = [];

  @Output() updateQuantity = new EventEmitter<{ productId: string, quantity: number }>();
  @Output() removeItem = new EventEmitter<string>();

  public onUpdateQuantity(productId: string, quantity: number): void {
    this.updateQuantity.emit({ productId, quantity });
  }

  public onRemoveItem(productId: string): void {
    this.removeItem.emit(productId);
  }

  public trackByProductId(index: number, item: CartItem): string {
    return item.productId;
  }
}
