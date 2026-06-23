import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartItem } from '../../../../core/types/cart.interface';
import { ProductTranslatePipe } from '../../../products/pipes/product-translate.pipe';
import { OfferBadgeComponent } from '../../../products/components/offer-badge/offer-badge.component';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { getAssetUrl, cleanPrice } from '../../../../core/utils';
import { QuantityControlsComponent } from '../quantity-controls/quantity-controls.component';

/**
 * CartItem - Individual Cart Item Component
 *
 * Represents a single product in the cart with detailed information:
 * - Product image
 * - Formatted name and price
 * - Offer badge if applicable
 * - Old price if on offer
 * - Unit of measure
 * - Quantity controls
 * - Remove button
 */
@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ProductTranslatePipe, QuantityControlsComponent, OfferBadgeComponent, IconComponent],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Input() isRemoving = false;
  @Input() isOffer = false;
  @Input() discountPercentage: number | null = null;

  @Output() updateQuantity = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  public readonly cleanPrice = cleanPrice;

  public getImageUrl(path: string): string {
    return getAssetUrl(path);
  }

  public getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }

  public getDiscountText(): string {
    return this.discountPercentage ? `-${this.discountPercentage}%` : '';
  }

  public getOldPriceDisplay(): string {
    if (!this.item.oldPrice) return '';
    return this.cleanPrice(this.item.oldPrice);
  }

  public onQuantityChange(newQuantity: number): void {
    this.updateQuantity.emit(newQuantity);
  }

  public onRemoveClick(): void {
    this.remove.emit();
  }
}
