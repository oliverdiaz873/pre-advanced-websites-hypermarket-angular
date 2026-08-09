import { Injectable, computed, inject, signal } from '@angular/core';
import { subcategorySlugFromHref } from '@data/category-section-map.data';
import { ProductService } from '@features/products/services/product.service';
import { offerProducts } from '@features/offers';
import { ProductUI } from '@features/products/models/product-ui.interface';

export interface OfferFilterCategory {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
/**
 * Service to manage offer filtering and sorting logic.
 * Encapsulates:
 * - Mapping offersData to products with discount information
 * - Category filtering (handling subcategory conversion)
 * - Sorting by discount (highest to lowest)
 */
export class OfferFiltersService {
  private readonly productService = inject(ProductService);
  readonly selectedCategory = signal('all');
  readonly offers = offerProducts();

  readonly categories = computed<OfferFilterCategory[]>(() => {
    return this.productService.categories().map(cat => ({
      id: cat.id,
      name: cat.name,
    }));
  });

  readonly filteredProducts = computed<ProductUI[]>(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.offers;

    const category = this.productService.categories().find(c => c.id === cat);
    if (!category) return [];

    const allowedSubcategories = category.subcategories.map(sub => subcategorySlugFromHref(sub.href));
    return this.offers.filter(p => allowedSubcategories.includes(p.categoria));
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
