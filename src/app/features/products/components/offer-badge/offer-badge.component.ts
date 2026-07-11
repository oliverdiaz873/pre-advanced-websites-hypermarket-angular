import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-offer-badge',
  standalone: true,
  imports: [],
  templateUrl: './offer-badge.component.html',
  styleUrl: './offer-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * OfferBadge - Visual badge for highlighting products on offer.
 * Includes a fire icon and displays the discount percentage.
 */
export class OfferBadgeComponent implements OnChanges {
  @Input() discountPercentage: number | null = null;

  displayText = '';
  ariaLabel = '';

  constructor(private translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['discountPercentage']) {
      this.displayText = this.computeDisplayText();
      this.ariaLabel = this.computeAriaLabel();
    }
  }

  private computeDisplayText(): string {
    if (!this.discountPercentage || this.discountPercentage <= 0) return '';
    return `-${this.discountPercentage}%`;
  }

  private computeAriaLabel(): string {
    if (!this.discountPercentage || this.discountPercentage <= 0) return '';
    return this.translate.instant('offers.badge.aria_label', {
      discount: `-${this.discountPercentage}%`
    });
  }
}
