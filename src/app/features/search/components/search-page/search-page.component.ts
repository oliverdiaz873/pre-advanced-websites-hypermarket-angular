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

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent, EmptySearchResultsComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private route = inject(ActivatedRoute);

  public readonly query = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('q') ?? '')),
    { initialValue: '' }
  );

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

  public readonly results = computed(() => {
    const q = this.query();
    if (!q.trim()) return this.allProducts;
    return this.allProducts.filter(p =>
      matchesSearchQuery(p.nombre, q)
    );
  });
}
