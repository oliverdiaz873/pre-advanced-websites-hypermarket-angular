import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { OfferFiltersService } from '../../services/offer-filters.service';

@Component({
  selector: 'app-offer-filters',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './offer-filters.component.html',
  styleUrl: './offer-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Offer filter component.
 *
 * ARCHITECTURE NOTE: Composition + Responsive Rendering pattern.
 * - This component is container-agnostic.
 * - On Desktop: injected into a static sidebar.
 * - On Mobile: composed inside a Drawer to optimize space (conditional rendering strategy).
 */
export class OfferFiltersComponent {
  @Input() isDrawer = false;
  @Output() categorySelected = new EventEmitter<void>();
  protected service = inject(OfferFiltersService);

  protected onCategorySelect(id: string): void {
    this.service.selectCategory(id);
    this.categorySelected.emit();
  }
}
