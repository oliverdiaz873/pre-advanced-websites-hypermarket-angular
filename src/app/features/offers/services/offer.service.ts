import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductUI } from '@features/products/models/product-ui.interface';
import { mapApiOffersToProductUI } from './offer.mapper';

/**
 * F5.4: única fuente de verdad de la información comercial de ofertas (GET /offers).
 *
 * - Carga /offers una sola vez (cache); el idioma (`?lang=`) lo estampa el
 *   interceptor api-lang y al cambiar de idioma se recarga.
 * - Expone `offers` (ProductUI[]) para la página de ofertas, y la misma lista se
 *   usa como lookup para enriquecer badges en todos los grids (search/category/home).
 * - No reintroduce datos mock: sin ofertas → lista vacía (nunca fallback local).
 */
@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly api = inject(ApiService);
  private readonly translate = inject(TranslateService);

  private readonly _offers = signal<ProductUI[]>([]);
  private readonly _offersLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly offers = this._offers.asReadonly();
  readonly offersLoading = this._offersLoading.asReadonly();
  readonly error = this._error.asReadonly();

  private initialised = false;

  constructor() {
    this.translate.onLangChange.subscribe(() => {
      if (this.initialised) {
        this.initialised = false;
        this.loadAll();
      }
    });
  }

  loadAll(): void {
    if (this.initialised) return;
    this.initialised = true;

    this._offersLoading.set(true);
    this._error.set(null);

    this.api.getOffers().subscribe({
      next: (envelope) => {
        this._offers.set(mapApiOffersToProductUI(envelope.data));
        this._offersLoading.set(false);
      },
      error: () => {
        this._offers.set([]);
        this._offersLoading.set(false);
        this._error.set('offers.load.failed');
      },
    });
  }
}