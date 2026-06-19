import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductPageData } from '../../../../data/product-page-data.data';
import { ProductTranslatePipe } from '../../pipes/product-translate.pipe';
import { AddToCartButtonComponent } from '../../../cart/components/add-to-cart-button/add-to-cart-button.component';
import { getAssetUrl } from '../../../../core/utils';

@Component({
  selector: 'app-product-detail-section',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProductTranslatePipe, AddToCartButtonComponent],
  templateUrl: './product-detail-section.component.html',
  styleUrl: './product-detail-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailSectionComponent {
  @Input({ required: true }) product!: ProductUI;
  @Input() pageData?: ProductPageData;

  public readonly getAssetUrl = getAssetUrl;

  public modalOpen = false;

  public openModal(): void {
    this.modalOpen = true;
  }

  public closeModal(): void {
    this.modalOpen = false;
  }
}
