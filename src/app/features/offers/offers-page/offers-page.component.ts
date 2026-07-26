import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { ProductGridComponent } from '@features/products/components/product-grid/product-grid.component';
import { OfferFiltersComponent } from '../components/offer-filters/offer-filters.component';
import { EmptyOffersComponent } from '../components/empty-offers/empty-offers.component';
import { IconComponent } from '@shared/components/icons/icons.component';
import { OfferFiltersService } from '../services/offer-filters.service';
import { OfferService } from '../services/offer.service';
import { BaseSkeletonComponent } from '@shared/components/skeleton/base-skeleton.component';
import { OffersGridSkeletonComponent } from '@shared/components/skeleton/offers-grid-skeleton.component';

@Component({
  selector: 'app-offers-page',
  standalone: true,
  imports: [
    TranslatePipe, DrawerComponent, ProductGridComponent, OfferFiltersComponent,
    EmptyOffersComponent, IconComponent, BaseSkeletonComponent, OffersGridSkeletonComponent,
  ],
  templateUrl: './offers-page.component.html',
  styleUrls: ['./offers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersPageComponent {
  protected filtersService = inject(OfferFiltersService);
  protected offerService = inject(OfferService);
  protected isDrawerOpen = signal(false);
  protected readonly loading = this.offerService.offersLoading;

  constructor() {
    this.offerService.loadAll();
  }
}
