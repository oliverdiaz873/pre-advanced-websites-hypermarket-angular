import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OfferCardSkeletonComponent } from './offer-card-skeleton.component';

@Component({
  selector: 'app-offers-grid-skeleton',
  standalone: true,
  imports: [OfferCardSkeletonComponent],
  template: `
    <section
      class="product-carousel-section bg-white px-2 md:px-8 py-2 md:py-6 mb-6 md:mb-6 w-full border-t border-gray-200"
      role="status"
      aria-label="Loading"
    >
      <div class="w-full">
        <div class="mb-4 md:mb-6 flex items-center gap-3">
          <div class="w-6 h-6 md:w-8 md:h-8 bg-linear-to-br from-orange-500 to-yellow-400 rounded-full animate-pulse"></div>
          <div class="h-6 md:h-7 w-40 md:w-48 bg-gray-300 rounded-3xl animate-pulse"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          @for (item of skeletonItems; track $index) {
            <app-offer-card-skeleton />
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersGridSkeletonComponent {
  readonly skeletonItems = Array.from({ length: 8 });
}
