import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductUI } from '../../models/product-ui.interface';
import { cleanPrice, getAssetUrl, unitLabel } from '../../../../core/utils';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: ProductUI;
  @Input() oldPrice?: string;
  @Input() badgeText?: string;
  @Input() actionText?: string;

  @Output() actionClick = new EventEmitter<ProductUI>();

  public readonly cleanPrice = cleanPrice;
  public readonly getAssetUrl = getAssetUrl;
  public readonly unitLabel = unitLabel;

  public get isOffer(): boolean {
    return !!this.oldPrice;
  }

  public onActionClick(event: Event): void {
    event.stopPropagation();
    this.actionClick.emit(this.product);
  }
}
