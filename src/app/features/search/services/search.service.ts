import { Injectable, inject, Signal, signal, DestroyRef, Injector } from '@angular/core';
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest, EMPTY, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { hasSearchQuery } from '@core/utils';
import { ProductService } from '@features/products/services/product.service';
import type { ProductUI } from '@features/products/models/product-ui.interface';

/**
 * Representa un producto en los resultados del typeahead del header.
 *
 * Contiene solo la información necesaria para renderizar el dropdown:
 * identificador, nombre visible (localizado por `?lang=`) y ruta de la imagen.
 */
export interface HeaderSearchProduct {
  id: string;
  name: string;
  imagen: string;
}

/**
 * Servicio central de búsqueda del header y de la página de resultados.
 *
 * F5.3.2: la fuente de datos es la API real (GET /search a través de
 * `ProductService.searchProducts`), no el catálogo mock.
 *
 * Responsabilidades:
 * - Gestionar el estado del typeahead del header (searchTerm, isSearchActive,
 *   searchResults, isSearching, searchError) con debounce de 300ms.
 * - Ejecutar la navegación a /search y a /product/:id
 * - Sincronizar la señal query con el parámetro ?q= de la URL
 * - Resolver los resultados de la página de búsqueda (searchQueryResults + loading/error)
 *
 * Características:
 * - `q` vacío: nunca se llama al API (guard local; el backend responde 400).
 * - `?lang=` estampado por el interceptor api-lang; al cambiar de idioma se
 *   re-ejecuta la búsqueda del término activo.
 * - Máximo 8 resultados en el typeahead.
 * - Estados loading/error/empty expuestos para consumidores.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private productService = inject(ProductService);

  /** Read-only signal derived from the current URL's ?q= param. */
  public readonly query: Signal<string> = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('q') ?? '')
    ),
    { initialValue: '' }
  );

  public readonly searchTerm = signal('');

  public readonly isSearchActive = signal(false);

  private readonly searchTrigger = new Subject<void>();

  private readonly searchResultsState = signal<HeaderSearchProduct[]>([]);
  private readonly isSearchingState = signal(false);
  private readonly searchErrorState = signal<string | null>(null);

  private readonly searchQueryResultsState = signal<ProductUI[]>([]);
  private readonly searchQueryLoadingState = signal(false);
  private readonly searchQueryErrorState = signal<string | null>(null);

  private querySearchSeq = 0;

  /** Resultados del typeahead del header (máx 8), desde la API. */
  public readonly searchResults = this.searchResultsState.asReadonly();

  /** Loading real del typeahead (F5.3.2; antes era una rama muerta). */
  public readonly isSearching = this.isSearchingState.asReadonly();

  /** Error del typeahead (null = sin error). */
  public readonly searchError = this.searchErrorState.asReadonly();

  /** Resultados completos de la página de búsqueda, desde la API. */
  public readonly searchQueryResults = this.searchQueryResultsState.asReadonly();

  /** Loading de la página de búsqueda. */
  public readonly searchQueryLoading = this.searchQueryLoadingState.asReadonly();

  /** Error de la página de búsqueda (null = sin error). */
  public readonly searchQueryError = this.searchQueryErrorState.asReadonly();

  constructor() {
    // Typeahead: debounce 300ms + switchMap; se re-dispara al cambiar de idioma.
    const typeahead$ = combineLatest([
      toObservable(this.searchTerm, { injector: this.injector }),
      this.searchTrigger.pipe(startWith(undefined)),
    ]).pipe(
      map(([term]) => term),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!hasSearchQuery(term)) {
          this.searchResultsState.set([]);
          this.isSearchingState.set(false);
          this.searchErrorState.set(null);
          return EMPTY;
        }
        this.isSearchingState.set(true);
        this.searchErrorState.set(null);
        return this.productService.searchProducts(term).pipe(
          map((products) =>
            products.slice(0, 8).map((product) => ({
              id: product.id,
              name: product.name,
              imagen: product.imagen,
            }))
          ),
          catchError(() => {
            this.searchErrorState.set('search.typeahead_error');
            return of<HeaderSearchProduct[]>([]);
          })
        );
      })
    );

    typeahead$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((results) => {
      this.searchResultsState.set(results);
      this.isSearchingState.set(false);
    });

    // Al cambiar de idioma, re-ejecutar la búsqueda del término activo para que
    // `?lang=` (interceptor) localice los nombres mostrados.
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (hasSearchQuery(this.searchTerm())) {
          this.searchTrigger.next();
        }
      });
  }

  public search(q: string): void {
    const trimmed = q.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { q: trimmed } });
    }
  }

  public clear(): void {
    this.router.navigate(['/']);
  }

  public setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  public toggleSearch(): void {
    this.isSearchActive.update((current) => !current);
    if (!this.isSearchActive()) {
      this.searchTerm.set('');
    }
  }

  /**
   * Ejecuta la acción de búsqueda según el estado actual del typeahead.
   *
   * - Si el search está cerrado → solo lo activa (el componente se encarga del foco)
   * - Si está abierto pero vacío → lo cierra y limpia el término
   * - Si está abierto con contenido → navega a /search?q=... y limpia el estado
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

  /**
   * Navega al detalle del producto seleccionado.
   * Limpia el término de búsqueda y cierra el typeahead antes de navegar.
   */
  public selectResult(id: string): void {
    this.searchTerm.set('');
    this.isSearchActive.set(false);
    this.router.navigate(['/product', id]);
  }

  /** Ejecuta la búsqueda de la página de resultados (?q=) contra la API. */
  public executeQuerySearch(q: string): void {
    const trimmed = q.trim();
    if (!trimmed) {
      this.clearQuerySearch();
      return;
    }

    const seq = ++this.querySearchSeq;
    this.searchQueryLoadingState.set(true);
    this.searchQueryErrorState.set(null);

    this.productService.searchProducts(trimmed).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (products) => {
        if (seq !== this.querySearchSeq) return;
        this.searchQueryResultsState.set(products);
        this.searchQueryLoadingState.set(false);
      },
      error: () => {
        if (seq !== this.querySearchSeq) return;
        this.searchQueryErrorState.set('search.query_error');
        this.searchQueryResultsState.set([]);
        this.searchQueryLoadingState.set(false);
      },
    });
  }

  /** Limpia los resultados de la página de búsqueda. */
  public clearQuerySearch(): void {
    this.querySearchSeq++;
    this.searchQueryLoadingState.set(false);
    this.searchQueryErrorState.set(null);
    this.searchQueryResultsState.set([]);
  }
}