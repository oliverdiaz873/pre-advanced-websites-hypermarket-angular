import { Component, inject } from '@angular/core';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';
import { CategoryBannerComponent, CategoryBannerData } from '../category-banner/category-banner.component';
import { CATEGORY_DATA } from '@data/categories.data';
import { TranslatePipe } from '@ngx-translate/core';
import { ViewportService } from '@core/services/viewport.service';
import { containerVariants, VIEWPORT_CONFIG } from '../category-banner/category-banner.animations';

@Component({
  selector: 'app-category-banners-section',
  standalone: true,
  imports: [CategoryBannerComponent, ScrollAnimateDirective, TranslatePipe],
  template: `
    <section id="category-banners" class="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-4 md:pt-10 md:pb-6">
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
    }
  `]
})
export class CategoryBannersSectionComponent {
  protected readonly categories = CATEGORY_DATA;
  protected readonly viewportService = inject(ViewportService);
  protected readonly viewportConfig = VIEWPORT_CONFIG;
  protected readonly containerVariants = containerVariants;
}
