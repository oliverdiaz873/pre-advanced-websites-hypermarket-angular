import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { products, offersData, calculateDiscountPercentage } from '../../../../data/index';
import { ProductUI } from '../../../products/models/product-ui.interface';
import { matchesSearchQuery } from '../../../../core/utils/search-utils';
import { ProductGridComponent } from '../../../products/components/product-grid/product-grid.component';
import { EmptySearchResultsComponent } from '../empty-search-results/empty-search-results.component';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent, EmptySearchResultsComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);

  /**
   * URL is the single source of truth.
   * query signal is derived from the router query param ?q=
   */
  public readonly query = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('q') ?? '')),
    { initialValue: '' }
  );

  /** All products enriched with offer data — computed once */
  private readonly allProducts: ProductUI[] = products.map(p => {
    const offer = offersData.find(o => o.id === p.id);
    if (!offer) return p;
    const discount = calculateDiscountPercentage(p.precio, offer.oldPrice);
    return {
      ...p,
      oldPrice: offer.oldPrice,
      badgeText: discount > 0 ? `-${discount}%` : undefined
    };
  });

  /**
   * Filtered product list — recomputes whenever the URL query param changes.
   * Uses normalizarTexto for accent-insensitive, case-insensitive matching.
   */
  public readonly results = computed(() => {
    const q = this.query();
    if (!q.trim()) return this.allProducts;
    return this.allProducts.filter(p =>
      matchesSearchQuery(p.nombre, q)
    );
  });

  public onProductAction(product: ProductUI): void {
    this.cartService.addItem(product);
  }
}
