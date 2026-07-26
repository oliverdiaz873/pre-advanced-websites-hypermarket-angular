import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseSkeletonComponent } from './base-skeleton.component';
import { ProductsGridSkeletonComponent } from './products-grid-skeleton.component';

@Component({
  selector: 'app-product-detail-skeleton',
  standalone: true,
  imports: [BaseSkeletonComponent, ProductsGridSkeletonComponent],
  template: `
    <div class="mx-auto max-w-[1280px] px-5">
      <app-base-skeleton className="h-5 w-56 rounded mb-4" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
        <div class="space-y-4">
          <div class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="grid grid-cols-4 gap-2">
            @for (item of thumbnails; track $index) {
              <div class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            }
          </div>
        </div>

        <div class="space-y-6">
          <div class="space-y-2">
            <div class="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div class="flex items-center gap-2">
            <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div class="space-y-2 py-4 border-y border-gray-200">
            <div class="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div class="space-y-2">
            <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div class="space-y-3 pt-4">
            <div class="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-8">
        <div class="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        <app-products-grid-skeleton [count]="6" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailSkeletonComponent {
  readonly thumbnails = Array.from({ length: 4 });
}
