import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '@core/types/cart.interface';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { offersData, calculateDiscountPercentage } from '../../../../data/offers.data';

interface EnrichedCartItem extends CartItem {
  isOffer: boolean;
  discountPercentage: number | null;
}

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

  public get enrichedItems(): EnrichedCartItem[] {
    return this.items.map(item => {
      const offer = offersData.find(o => o.id === item.productId);
      const discountPercentage = offer?.oldPrice
        ? calculateDiscountPercentage(item.unitPrice, offer.oldPrice)
        : null;
      return { ...item, isOffer: !!offer, discountPercentage };
    });
  }

  public onUpdateQuantity(productId: string, quantity: number): void {
    this.updateQuantity.emit({ productId, quantity });
  }

  public onRemoveItem(productId: string): void {
    this.removeItem.emit(productId);
  }

  public trackByProductId(index: number, item: EnrichedCartItem): string {
    return item.productId;
  }
}
