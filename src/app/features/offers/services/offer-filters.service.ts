import { Injectable, computed, signal } from '@angular/core';
import { categories as CATEGORIES } from '@data/index';
import { offerProducts } from '@features/offers';
import { ProductUI } from '@features/products/models/product-ui.interface';

export interface OfferFilterCategory {
  id: string;
  name: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class OfferFiltersService {
  readonly selectedCategory = signal('all');
  readonly offers = offerProducts();

  readonly categories = computed<OfferFilterCategory[]>(() => {
    return CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: this.offers.filter(p => p.categoria === cat.id).length,
    }));
  });

  readonly filteredProducts = computed<ProductUI[]>(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.offers;
    return this.offers.filter(p => p.categoria === cat);
  });

  selectCategory(id: string): void {
    this.selectedCategory.set(id);
  }
}
