import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-categories-skeleton',
  standalone: true,
  template: `
    <section
      class="product-carousel-section bg-white px-2 md:px-8 py-3 md:py-6 mb-6 w-full border-t border-gray-200"
      role="status"
      aria-label="Loading"
    >
      <div class="w-full">
        <div class="mb-4 md:mb-6">
          <div class="h-6 md:h-7 w-40 md:w-48 bg-gray-300 rounded-3xl animate-pulse"></div>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          @for (item of skeletonItems; track item) {
            <div class="flex flex-col items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors animate-pulse">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-lg"></div>
              <div class="w-full">
                <div class="h-3 md:h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesSkeletonComponent {
  readonly skeletonItems = Array.from({ length: 6 });
}
