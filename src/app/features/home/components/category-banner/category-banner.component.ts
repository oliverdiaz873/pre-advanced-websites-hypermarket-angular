import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';
import { getAssetUrl } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { CATEGORY_BANNER_ANIMATIONS } from './category-banner.animations';

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
  protected readonly getAssetUrl = getAssetUrl;
  protected readonly animations = CATEGORY_BANNER_ANIMATIONS;
}
