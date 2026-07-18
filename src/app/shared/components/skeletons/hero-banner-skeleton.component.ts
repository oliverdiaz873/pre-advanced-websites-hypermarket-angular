import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-banner-skeleton',
  standalone: true,
  template: `
    <section
      class="hero-carousel-section w-full bg-white px-2 py-1 mb-4 md:px-8 md:py-2 md:mb-4 md:max-w-[1400px] md:mx-auto"
      role="status"
      aria-label="Loading"
    >
      <div
        class="hero-carousel-container max-w-full bg-gray-300 rounded-[20px] overflow-hidden animate-pulse relative md:aspect-3/1 md:min-h-[350px]"
        style="box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); aspect-ratio: 3 / 1.1; min-height: 200px"
      >
        <div class="absolute inset-0 bg-linear-to-r from-gray-400 via-gray-300 to-gray-400"></div>

        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          @for (dot of dots; track $index) {
            <div class="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full animate-pulse"></div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroBannerSkeletonComponent {
  readonly dots = Array.from({ length: 3 });
}
