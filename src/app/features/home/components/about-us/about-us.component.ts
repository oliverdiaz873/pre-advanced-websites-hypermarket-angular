import { Component, ChangeDetectionStrategy } from '@angular/core';
import { getAssetUrl } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollScaleDirective } from '../../directives/scroll-scale.directive';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [TranslatePipe, ScrollScaleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
/**
 * AboutUsComponent
 *
 * Renders the "About Us" section with a logo image, title and description.
 * On scroll, applies a scale+opacity animation driven by ScrollScaleDirective
 * with rAF-throttled scroll progress and mobile-aware easing.
 */
export class AboutUsComponent {
  protected readonly getAssetUrl = getAssetUrl;
}
