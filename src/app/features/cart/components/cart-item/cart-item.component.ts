import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../../core/types/cart.interface';
import { ProductTranslatePipe } from '../../../products/pipes/product-translate.pipe';
import { OfferBadgeComponent } from '../../../products/components/offer-badge/offer-badge.component';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { getAssetUrl } from '../../../../core/utils';
import { QuantityControlsComponent } from '../quantity-controls/quantity-controls.component';
import { calculateDiscountPercentage } from '../../../../data/offers.data';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductTranslatePipe, QuantityControlsComponent, OfferBadgeComponent, IconComponent],
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

  public getIsOffer(): boolean {
    return !!this.item.oldPrice;
  }

  public getDiscountText(): string {
    if (!this.item.oldPrice) return '';
    const discount = calculateDiscountPercentage(this.item.unitPrice, this.item.oldPrice);
    return discount > 0 ? `-${discount}%` : '';
  }

  public getOldPriceDisplay(): string {
    if (!this.item.oldPrice) return '';
    const num = this.parseOldPrice(this.item.oldPrice);
    if (!num) return this.item.oldPrice;
    return `$${num.toLocaleString()}`;
  }

  private parseOldPrice(oldPrice: string): number | null {
    const cleaned = oldPrice.replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  public onQuantityChange(newQuantity: number): void {
    this.updateQuantity.emit(newQuantity);
  }

  public onRemoveClick(): void {
    this.remove.emit();
  }
}
