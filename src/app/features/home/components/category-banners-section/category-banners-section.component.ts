import { Component, inject } from '@angular/core';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';
import { CategoryBannerComponent, CategoryBannerData } from '../category-banner/category-banner.component';
import { CATEGORY_DATA } from '@data/categories.data';
import { TranslatePipe } from '@ngx-translate/core';
import { ViewportService } from '@core/services/viewport.service';
import { containerVariants, VIEWPORT_CONFIG } from '../category-banner/category-banner.animations';

/**
 * Aggregates and displays the curated category showcases dynamically.
 *
 * Features customizable layout parameters, ngx-translate integration,
 * viewport-driven responsive animation values, alternating card layouts
 * via `reversed` input, and scroll-reveal animations for both the
 * section header and individual category cards.
 */
@Component({
  selector: 'app-category-banners-section',
  standalone: true,
  imports: [CategoryBannerComponent, ScrollAnimateDirective, TranslatePipe],
  template: `
    <section id="category-banners" class="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-4 md:pt-10 md:pb-6">
      <!--
        Section header animated on scroll.
        Uses fixed scrollY=30 / scrollDuration=0.6 matching Next.js sectionTitleVariants.
      -->
      <div
        class="text-center mb-8 md:mb-12"
        appScrollAnimate
        scrollAnimation="fade-up"
        [scrollY]="30"
        [scrollDuration]="0.6"
        [scrollMargin]="viewportConfig.margin"
      >
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          {{ 'home.category_banners.section_title' | translate }}
        </h2>
        <p class="mt-3 text-base md:text-lg text-gray-500 max-w-xl mx-auto">
          {{ 'home.category_banners.section_subtitle' | translate }}
        </p>
      </div>

      <!--
        Banners rendered in a single-column flex layout.
        Each card receives computed containerVariants based on its index
        and the current isMobile state, enabling responsive stagger,
        translateY distance, and animation duration.
      -->
      <div class="flex flex-col gap-6 md:gap-8">
        @for (cat of categories; track cat.id; let i = $index) {
          <app-category-banner
            [data]="cat"
            [reversed]="i % 2 !== 0"
            [scrollDelay]="containerVariants(i, viewportService.isMobile()).scrollDelay"
            [scrollY]="containerVariants(i, viewportService.isMobile()).scrollY"
            [scrollDuration]="containerVariants(i, viewportService.isMobile()).scrollDuration"
          />
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }
  `]
})
export class CategoryBannersSectionComponent {
  /** Metadata list defining color mappings, assets, routing, and translation keys for the 8 featured categories. */
  protected readonly categories = CATEGORY_DATA;
  /** Tracks the current viewport to compute responsive animation values at render time. */
  protected readonly viewportService = inject(ViewportService);
  /** Viewport scroll-trigger config shared with text elements inside each banner (margin: -40px). */
  protected readonly viewportConfig = VIEWPORT_CONFIG;
  /**
   * Generates container-level animation parameters for each banner card.
   * Values (scrollDelay, scrollY, scrollDuration) adapt to both index stagger and mobile state.
   */
  protected readonly containerVariants = containerVariants;
}
