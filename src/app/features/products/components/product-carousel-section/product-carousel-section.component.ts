import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductCarouselComponent } from '../product-carousel/product-carousel.component';

@Component({
  selector: 'app-product-carousel-section',
  standalone: true,
  imports: [CommonModule, ProductCarouselComponent],
  templateUrl: './product-carousel-section.component.html',
  styleUrl: './product-carousel-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselSectionComponent {
  /** Section heading text (already translated string or i18n key resolved by parent) */
  @Input() title = '';
  @Input() products: ProductUI[] = [];
  @Input() actionText?: string;

  @Output() productAction = new EventEmitter<ProductUI>();

  public onProductAction(product: ProductUI): void {
    this.productAction.emit(product);
  }
}
