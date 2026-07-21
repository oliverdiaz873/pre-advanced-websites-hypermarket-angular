import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { products } from '../../../../data/index';
import { offersData, calculateDiscountPercentage } from '@features/offers';
import { ProductUI } from '../../../products/models/product-ui.interface';
import { matchesSearchQuery } from '../../../../core/utils/search-utils';
import { SeoService } from '../../../../core/services/seo.service';
import { ProductTranslationService } from '@features/products/services/product-translation.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProductGridComponent } from '../../../products/components/product-grid/product-grid.component';
import { EmptySearchResultsComponent } from '../empty-search-results/empty-search-results.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent, EmptySearchResultsComponent, TranslatePipe],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private route = inject(ActivatedRoute);
  private productTranslation = inject(ProductTranslationService);
  private seo = inject(SeoService);
  private translate = inject(TranslateService);

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
      discountPercentage: discount > 0 ? discount : undefined
    };
  });

  public readonly results = computed(() => {
    const q = this.query();
    if (!q.trim()) return [];
    return this.allProducts.filter(p => {
      const translatedName = this.productTranslation.getName(p);
      return [p.nombre, translatedName]
        .some(value => matchesSearchQuery(value, q));
    });
  });

  constructor() {
    effect(() => {
      this.applySearchSeo(this.query(), this.results().length);
    });
  }

  private applySearchSeo(query: string, resultCount: number): void {
    const cleanQuery = query.trim();
    const canonicalPath = cleanQuery ? `/search?q=${encodeURIComponent(cleanQuery)}` : '/search';
    const title = cleanQuery
      ? this.translate.instant('search.seo.title_query', { query: cleanQuery })
      : this.translate.instant('search.seo.title_empty');
    const description = cleanQuery
      ? this.translate.instant('search.seo.desc_query', { query: cleanQuery })
      : this.translate.instant('search.seo.desc_empty');

    this.seo.applySeo({
      title,
      description,
      canonicalPath,
      robots: 'noindex, nofollow',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: this.seo.absoluteUrl(canonicalPath),
        numberOfItems: resultCount
      }
    });
  }
}
