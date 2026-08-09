import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { offersData, calculateDiscountPercentage } from '@features/offers';
import { ProductUI } from '../../../products/models/product-ui.interface';
import { SeoService } from '../../../../core/services/seo.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProductGridComponent } from '../../../products/components/product-grid/product-grid.component';
import { EmptySearchResultsComponent } from '../empty-search-results/empty-search-results.component';
import { SearchService } from '../../services/search.service';
import { BaseSkeletonComponent } from '@shared/components/skeleton/base-skeleton.component';
import { ProductsGridSkeletonComponent } from '@shared/components/skeleton/products-grid-skeleton.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent, EmptySearchResultsComponent, TranslatePipe, BaseSkeletonComponent, ProductsGridSkeletonComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private translate = inject(TranslateService);
  protected searchService = inject(SearchService);

  public readonly query = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('q') ?? '')),
    { initialValue: '' }
  );

  /** Resultados de la API enriquecidos con los badges de oferta locales. */
  public readonly results = computed(() =>
    this.searchService.searchQueryResults().map(p => {
      const offer = offersData.find(o => o.id === p.id);
      if (!offer) return p;
      const discount = calculateDiscountPercentage(p.precio, offer.oldPrice);
      return {
        ...p,
        oldPrice: offer.oldPrice,
        discountPercentage: discount > 0 ? discount : undefined
      };
    })
  );

  /** Cantidad de resultados (para SEO); derivación de solo lectura. */
  private readonly resultCount = computed(() =>
    this.searchService.searchQueryResults().length
  );

  constructor() {
    // Effect de fetch: depende únicamente de query(). No lee searchQueryResults()
    // ni ninguna señal que executeQuerySearch escriba, por lo que un cambio en
    // los resultados ya no vuelve a disparar el fetch (fix P0-A: bucle de refetch).
    effect(() => {
      const q = this.query();
      this.searchService.executeQuerySearch(q);
    });

    // Effect de SEO: solo lectura de resultados; no escribe señales observadas
    // por el effect de fetch.
    effect(() => {
      this.applySearchSeo(this.query(), this.resultCount());
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