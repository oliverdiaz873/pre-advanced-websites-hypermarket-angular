import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProductCardSkeletonComponent } from './product-card-skeleton.component';

@Component({
  selector: 'app-products-grid-skeleton',
  standalone: true,
  imports: [ProductCardSkeletonComponent],
  template: `
    <section
      class="product-carousel-section bg-white px-2 md:px-8 py-2 md:py-6 mb-6 md:mb-6 w-full border-t border-gray-200"
      role="status"
      aria-label="Loading"
    >
      <div class="w-full">
        <div class="mb-4 md:mb-6">
          <div class="h-6 md:h-7 w-40 md:w-48 bg-gray-300 rounded-3xl inline-block animate-pulse"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          @for (item of skeletonItems; track $index) {
            <app-product-card-skeleton />
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsGridSkeletonComponent {
  @Input() count = 8;

  get skeletonItems(): number[] {
    return Array.from({ length: this.count });
  }
}
