import { Injectable, signal } from '@angular/core';
import { offerProducts } from '@features/offers';
import { ProductUI } from '@features/products/models/product-ui.interface';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private _offers = signal<ProductUI[]>([]);
  private _offersLoading = signal(true);
  private _error = signal<string | null>(null);

  readonly offers = this._offers.asReadonly();
  readonly offersLoading = this._offersLoading.asReadonly();
  readonly error = this._error.asReadonly();

  private initialised = false;

  loadAll(): void {
    if (this.initialised) return;
    this.initialised = true;

    this._offers.set(offerProducts());
    this._offersLoading.set(false);
  }
}
