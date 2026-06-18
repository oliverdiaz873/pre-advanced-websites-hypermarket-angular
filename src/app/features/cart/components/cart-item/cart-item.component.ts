import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../core/types/cart.interface';
import { getAssetUrl } from '../../../../core/utils';
import { QuantityControlsComponent } from '../quantity-controls/quantity-controls.component';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, QuantityControlsComponent],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent {
  @Input() item!: CartItem;

  @Output() updateQuantity = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  public getImageUrl(path: string): string {
    return getAssetUrl(path);
  }

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }

  public getSubtotal(price: number, quantity: number): string {
    return `$${(price * quantity).toLocaleString()}`;
  }

  public onQuantityChange(newQuantity: number): void {
    this.updateQuantity.emit(newQuantity);
  }

  public onRemoveClick(): void {
    this.remove.emit();
  }
}
