import { Injectable, inject, Signal, signal, computed, DestroyRef } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { products } from '@data/products.data';
import { normalizarTexto, hasSearchQuery } from '@core/utils';

/**
 * SearchService — URL is the single source of truth for the search results page.
 *
 * The `query` signal is derived from the router query params, not stored
 * in-memory independently. This avoids desyncs between URL and state.
 *
 * Extended with header search state (searchTerm, isSearchActive, searchResults)
 * for the live-search typeahead used by DesktopSearchComponent.
 */
export interface HeaderSearchProduct {
  id: string;
  nombre: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  /**
   * Read-only signal derived from the current URL's ?q= param.
   * Automatically updates whenever the route changes.
   */
  public readonly query: Signal<string> = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('q') ?? '')
    ),
    { initialValue: '' }
  );

  /**
   * Header search — current input value for the typeahead.
   */
  public readonly searchTerm = signal('');

  /**
   * Header search — whether the desktop search input is expanded.
   */
  public readonly isSearchActive = signal(false);

  /**
   * Internal signal bumped on every language change so the computed
   * below re-evaluates when translations are swapped.
   */
  private readonly langVersion = signal(0);

  /**
   * Live-filtered products for the header typeahead dropdown.
   * - Normalises query and product names (lowercase, no accents)
   * - Matches against ES name and EN translated name
   * - Returns at most 8 results
   */
  public readonly searchResults: Signal<HeaderSearchProduct[]> = computed(() => {
    this.langVersion();
    const term = this.searchTerm().trim();
    if (!term) return [];

    const normalizedTerm = normalizarTexto(term);

    return products
      .filter((product) => {
        const nombreEs = normalizarTexto(product.nombre);
        const key = `products.${product.id}.name`;
        const translated = this.translate.instant(key);
        const nombreEn =
          translated !== key ? normalizarTexto(translated) : nombreEs;

        return nombreEs.includes(normalizedTerm) || nombreEn.includes(normalizedTerm);
      })
      .map((product) => {
        const key = `products.${product.id}.name`;
        const translated = this.translate.instant(key);

        return {
          id: product.id,
          nombre: translated !== key ? translated : product.nombre,
          imagen: product.imagen
        };
      })
      .slice(0, 8);
  });

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.langVersion.update((v) => v + 1));
  }

  /**
   * Navigate to /search with the provided query string.
   * This is the only way to mutate the search state.
   */
  public search(q: string): void {
    const trimmed = q.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { q: trimmed } });
    }
  }

  /**
   * Clear the search query by navigating back to home.
   */
  public clear(): void {
    this.router.navigate(['/']);
  }

  // ──────────────────────────────────────────────
  //  Header search handlers  (replaces useHeaderSearch)
  // ──────────────────────────────────────────────

  /** Update the typeahead input value. */
  public setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  /** Toggle the search field open/closed. Clears term when closing. */
  public toggleSearch(): void {
    this.isSearchActive.update((current) => !current);
    if (!this.isSearchActive()) {
      this.searchTerm.set('');
    }
  }

  /**
   * Submit the current search term.
   * - If search is closed → opens it (caller should auto-focus)
   * - If search is open but empty → closes it
   * - If search is open with text → navigates to /search?q=...
   */
  public submitSearch(): void {
    if (!this.isSearchActive()) {
      this.isSearchActive.set(true);
      return;
    }

    if (!hasSearchQuery(this.searchTerm())) {
      this.isSearchActive.set(false);
      this.searchTerm.set('');
      return;
    }

    const term = this.searchTerm().trim();

    this.router.navigate(['/search'], { queryParams: { q: term } });
    this.searchTerm.set('');
    this.isSearchActive.set(false);
  }

  /** Navigate to a product detail page. */
  public selectResult(id: string): void {
    this.searchTerm.set('');
    this.isSearchActive.set(false);
    this.router.navigate(['/product', id]);
  }
}
