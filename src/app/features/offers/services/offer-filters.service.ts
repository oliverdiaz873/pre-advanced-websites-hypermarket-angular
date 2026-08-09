import { Injectable, computed, inject, signal } from '@angular/core';
import { subcategorySlugFromHref } from '@data/category-section-map.data';
import { ProductService } from '@features/products/services/product.service';
import { OfferService } from './offer.service';
import { ProductUI } from '@features/products/models/product-ui.interface';

export interface OfferFilterCategory {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
/**
 * Service to manage offer filtering and sorting logic.
 * Encapsulates:
 * - Offer list source (F5.4: real backend via OfferService, no mock)
 * - Category filtering (handling subcategory conversion)
 * - Sorting by discount (highest to lowest)
 */
export class OfferFiltersService {
  private readonly productService = inject(ProductService);
  private readonly offerService = inject(OfferService);
  readonly selectedCategory = signal('all');

  readonly categories = computed<OfferFilterCategory[]>(() => {
    return this.productService.categories().map(cat => ({
      id: cat.id,
      name: cat.name,
    }));
  });

  readonly filteredProducts = computed<ProductUI[]>(() => {
    const offers = this.offerService.offers();
    const cat = this.selectedCategory();
    if (cat === 'all') return offers;

    const category = this.productService.categories().find(c => c.id === cat);
    if (!category) return [];

    const allowedSubcategories = category.subcategories.map(sub => subcategorySlugFromHref(sub.href));
    return offers.filter(p => allowedSubcategories.includes(p.categoria));
  });

  readonly sortedProducts = computed<ProductUI[]>(() =>
    [...this.filteredProducts()].sort((a, b) =>
      (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0)
    )
  );

  selectCategory(id: string): void {
    this.selectedCategory.set(id);
  }
}
