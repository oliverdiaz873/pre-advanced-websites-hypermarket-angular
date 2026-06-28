import { Component, Input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';
import { getAssetUrl } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { ViewportService } from '@core/services/viewport.service';
import { textAnimationVariants, TEXT_TRANSITION_CONFIGS, VIEWPORT_CONFIG } from './category-banner.animations';

export interface CategoryBannerData {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  imageSrc: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
}

@Component({
  selector: 'app-category-banner',
  standalone: true,
  imports: [RouterLink, ScrollAnimateDirective, TranslatePipe],
  templateUrl: './category-banner.component.html',
  styleUrls: ['./category-banner.component.scss']
})
export class CategoryBannerComponent {
  @Input({ required: true }) data!: CategoryBannerData;
  @Input() reversed = false;
  @Input() scrollDelay = 0;
  @Input() scrollY = 60;
  @Input() scrollDuration = 0.7;

  private readonly viewportService = inject(ViewportService);
  protected readonly getAssetUrl = getAssetUrl;
  protected readonly viewportConfig = VIEWPORT_CONFIG;
  protected readonly textTransitionConfigs = TEXT_TRANSITION_CONFIGS;
  protected readonly textParams = computed(() =>
    textAnimationVariants(this.viewportService.isMobile())
  );
}
