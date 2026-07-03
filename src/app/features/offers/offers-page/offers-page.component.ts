import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { ProductGridComponent } from '@features/products/components/product-grid/product-grid.component';
import { OfferFiltersComponent } from '../components/offer-filters/offer-filters.component';
import { EmptyOffersComponent } from '../components/empty-offers/empty-offers.component';
import { OfferFiltersService } from '../services/offer-filters.service';

@Component({
  selector: 'app-offers-page',
  standalone: true,
  imports: [TranslatePipe, DrawerComponent, ProductGridComponent, OfferFiltersComponent, EmptyOffersComponent],
  templateUrl: './offers-page.component.html',
  styleUrls: ['./offers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersPageComponent {
  protected filtersService = inject(OfferFiltersService);
  protected isDrawerOpen = signal(false);
}
