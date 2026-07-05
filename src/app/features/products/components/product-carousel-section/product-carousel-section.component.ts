import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductCarouselComponent } from '../product-carousel/product-carousel.component';

/**
 * ProductCarouselSection - Carousel block section structure.
 * Responsible for:
 * 1. Defining the section container (background, padding).
 * 2. Rendering the section title.
 * 3. Passing product data to the carousel.
 * 4. Using ProductCarousel as its scroll "engine".
 */
@Component({
  selector: 'app-product-carousel-section',
  standalone: true,
  imports: [CommonModule, ProductCarouselComponent],
  templateUrl: './product-carousel-section.component.html',
  styleUrl: './product-carousel-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselSectionComponent {
  @Input() title = '';
  @Input() products: ProductUI[] = [];
}
