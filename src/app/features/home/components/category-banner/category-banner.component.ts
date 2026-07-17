import { Component, Input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';
import { IconComponent } from '@shared/components/icons/icons.component';
import { getAssetUrl } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { ViewportService } from '@core/services/viewport.service';
import { textAnimationVariants, TEXT_TRANSITION_CONFIGS, VIEWPORT_CONFIG } from './category-banner.animations';

/**
 * Properties for each category banner card.
 *
 * Mirrors the shape of the items in `CATEGORY_DATA` and is consumed
 * as a single `data` input by `CategoryBannerComponent`.
 */
export interface CategoryBannerData {
  /** Unique identifier matching the data source key (e.g. "alimentos"). */
  id: string;
  /** ngx-translate key for the card title (e.g. "home.category_banners.alimentos.title"). */
  title: string;
  /** ngx-translate key for the marketing description text. */
  description: string;
  /** ngx-translate key for the CTA button label. */
  buttonText: string;
  /** Absolute or relative routing path when clicking the card. */
  href: string;
  /** Path to the category product spotlight image in the assets folder. */
  imageSrc: string;
  /** Tailwind-compatible hex color for the background gradient start. */
  gradientFrom: string;
  /** Tailwind-compatible hex color for the background gradient end. */
  gradientTo: string;
  /** Core theme glow and outline color matching the product context. */
  accentColor: string;
}

/**
 * Renders a premium, glassmorphic banner for an e-commerce category.
 *
 * Features an organic alternating column layout via `reversed`, responsive
 * stacking behaviour, scroll-reveal staggered animation via `ScrollAnimateDirective`,
 * and a continuous floating animation on the product image.
 */
@Component({
  selector: 'app-category-banner',
  standalone: true,
  imports: [RouterLink, ScrollAnimateDirective, TranslatePipe, IconComponent],
  templateUrl: './category-banner.component.html',
  styleUrls: ['./category-banner.component.scss']
})
export class CategoryBannerComponent {
  /** Full category data object containing all display and styling properties. */
  @Input({ required: true }) data!: CategoryBannerData;
  /** When true, swaps the content layout so the image appears on the left. */
  @Input() reversed = false;
  /** Stagger delay (ms) before the card entrance animation starts. Computed from `containerVariants`. */
  @Input() scrollDelay = 0;
  /** TranslateY distance (px) for the card's fade-up animation. Updated reactively via `containerVariants`. */
  @Input() scrollY = 60;
  /** Duration (seconds) of the card's entrance transition. Updated reactively via `containerVariants`. */
  @Input() scrollDuration = 0.7;

  private readonly viewportService = inject(ViewportService);
  /** Utility that resolves asset paths from the project's asset base URL. */
  protected readonly getAssetUrl = getAssetUrl;
  /** Shared viewport configuration (margin: -40px) passed to child text animation elements. */
  protected readonly viewportConfig = VIEWPORT_CONFIG;
  /** Stagger delay configs for title (100ms), description (200ms), and button (300ms) text elements. */
  protected readonly textTransitionConfigs = TEXT_TRANSITION_CONFIGS;
  /**
   * Computed text animation parameters that react to viewport changes.
   * On mobile: scrollY=20, scrollDuration=0.45.
   * On desktop: scrollY=40, scrollDuration=0.6.
   */
  protected readonly textParams = computed(() =>
    textAnimationVariants(this.viewportService.isMobile())
  );
}
