import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '@core/api/api.service';
import type { ApiProduct } from '@core/api/api-types';
import { mapApiCategoriesToCategories } from '@core/api/category.mapper';
import type { Category } from '@core/types/category.interface';
import type { CategorySection } from '@data/catalog.helpers';
import { subcategorySlugFromHref } from '@data/category-section-map.data';
import { ProductUI } from '../models/product-ui.interface';
import { Product } from '@core/types/product.interface';
import { mapApiProductToProductUI, mapApiProductsToProductUI, toProductUI } from './product.mapper';

/**
 * ProductService - orquesta productos de la API real (F5.2).
 *
 * Mantiene la superficie de signals que consumen Home/Category/ProductPage:
 * products, featured, detail, related, loading flags y error. El idioma
 * (`?lang=`) lo estampa el interceptor api-lang a partir de ngx-translate.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  private readonly _products = signal<ProductUI[]>([]);
  private readonly _featured = signal<ProductUI[]>([]);
  private readonly _detail = signal<ProductUI | undefined>(undefined);
  private readonly _related = signal<ProductUI[]>([]);
  private readonly _productsLoading = signal(false);
  private readonly _detailLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly products = this._products.asReadonly();
  readonly featured = this._featured.asReadonly();
  readonly detail = this._detail.asReadonly();
  readonly related = this._related.asReadonly();
  readonly productsLoading = this._productsLoading.asReadonly();
  readonly productDetailLoading = this._detailLoading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Carga una página de productos (GET /products). El limit por defecto es el del
   * backend; nunca se eleva MAX_LIMIT (decisión F5.0).
   */
  loadProducts(options: { page?: number; limit?: number; category?: string; q?: string } = {}): void {
    this._productsLoading.set(true);
    this._error.set(null);

    this.api.getProducts({
      page: options.page,
      limit: options.limit,
      category: options.category,
      q: options.q,
    }).subscribe({
      next: (collection) => {
        this._products.set(mapApiProductsToProductUI(collection.data).map(toProductUI));
        this._productsLoading.set(false);
      },
      error: () => {
        this._error.set('No se pudieron cargar los productos.');
        this._productsLoading.set(false);
      },
    });
  }

  /**
   * Carga productos destacados por id mediante requests específicos
   * (GET /products/:id). No se aplanan 184 productos en el home (decisión F5.0).
   */
  loadFeatured(featuredIds: string[]): void {
    this._productsLoading.set(true);
    this._error.set(null);

    if (featuredIds.length === 0) {
      this._featured.set([]);
      this._productsLoading.set(false);
      return;
    }

    let pending = featuredIds.length;
    const collected: ProductUI[] = [];

    featuredIds.forEach((id) => {
      this.api.getProduct(id).subscribe({
        next: (envelope) => {
          collected.push(toProductUI(mapApiProductToProductUI(envelope.data)));
          if (--pending === 0) {
            this._featured.set(collected);
            this._productsLoading.set(false);
          }
        },
        error: () => {
          if (--pending === 0) {
            this._featured.set(collected);
            this._productsLoading.set(false);
          }
        },
      });
    });
  }

  /** Carga el detalle de un producto (GET /products/:id) y sus relacionados. */
  loadProductDetail(id: string): void {
    this._detailLoading.set(true);
    this._error.set(null);

    this.api.getProduct(id).subscribe({
      next: (envelope) => {
        const product = toProductUI(mapApiProductToProductUI(envelope.data));
        this._detail.set(product);
        this._detailLoading.set(false);
        this.loadRelated(product);
      },
      error: () => {
        this._detail.set(undefined);
        this._detailLoading.set(false);
      },
    });
  }

  /** Carga hasta 8 productos de la misma categoría (GET /products?category=slug). */
  private loadRelated(product: Product): void {
    this.api.getProducts({ category: product.categoria, limit: 50 }).subscribe({
      next: (collection) => {
        this._related.set(
          mapApiProductsToProductUI(collection.data)
            .filter((p) => p.id !== product.id)
            .slice(0, 8)
            .map(toProductUI)
        );
      },
      error: () => this._related.set([]),
    });
  }

  /** Categorías (GET /api/categories) mapeadas al modelo UI; y secciones de
   *  categoría cargadas desde la API con paginación (F5.3.1).
   */
  private readonly _categories = signal<Category[]>([]);
  private readonly _categoriesLoading = signal(false);
  private readonly _categoriesLoaded = signal(false);
  private readonly _categorySections = signal<Record<string, CategorySection[]>>({});
  private readonly _categorySectionsLoading = signal(false);

  readonly categories = this._categories.asReadonly();
  readonly categoriesLoading = this._categoriesLoading.asReadonly();
  readonly categoriesLoaded = this._categoriesLoaded.asReadonly();
  readonly categorySections = this._categorySections.asReadonly();
  readonly categorySectionsLoading = this._categorySectionsLoading.asReadonly();

  /** Carga las categorías una sola vez (cache). `slug` = identidad de navegación. */
  loadCategories(): void {
    if (this._categoriesLoaded()) return;
    this._categoriesLoading.set(true);

    this.api.getCategories().subscribe({
      next: (envelope) => {
        this._categories.set(mapApiCategoriesToCategories(envelope.data));
        this._categoriesLoaded.set(true);
        this._categoriesLoading.set(false);
      },
      error: () => {
        this._categoriesLoading.set(false);
      },
    });
  }

  /** Carga una sección por subcategoría respetando la paginación del backend:
   *  nunca asume que una sola respuesta contiene todos los productos (decisión
   *  F5.0; se pagen todas las páginas con el límite permitido).
   */
  private fetchAllProductsInCategory(slug: string): Observable<ProductUI[]> {
    const LIMIT = 100;

    return this.api.getProducts({ category: slug, page: 1, limit: LIMIT }).pipe(
      switchMap((first) => {
        const total = first.pagination?.total ?? first.data.length;
        const pages = Math.max(1, Math.ceil(total / LIMIT));

        if (pages <= 1) {
          return of(first.data);
        }

        const remaining: Observable<typeof first>[] = [];
        for (let page = 2; page <= pages; page++) {
          remaining.push(this.api.getProducts({ category: slug, page, limit: LIMIT }));
        }

        return forkJoin(remaining).pipe(
          map((rest) => first.data.concat(...rest.map((collection) => collection.data)))
        );
      }),
      map((raw) => mapApiProductsToProductUI(raw).map(toProductUI))
    );
  }

  /** Construye las secciones (una por subcategoría) de una categoría desde la API. */
  loadCategorySections(category: Category): void {
    const categoryId = category.id;
    if (this._categorySections()[categoryId]) return;
    this._categorySectionsLoading.set(true);

    const sections: CategorySection[] = [];
    const subs = category.subcategories.map((sub) => ({
      slug: subcategorySlugFromHref(sub.href),
      name: sub.name,
    }));

    if (subs.length === 0) {
      this._categorySections.update((current) => ({ ...current, [categoryId]: sections }));
      this._categorySectionsLoading.set(false);
      return;
    }

    let pending = subs.length;
    subs.forEach((sub, index) => {
      this.fetchAllProductsInCategory(sub.slug).subscribe({
        next: (products) => {
          sections[index] = { id: sub.slug, name: sub.name, products };
          if (--pending === 0) {
            this._categorySections.update((current) => ({ ...current, [categoryId]: sections }));
            this._categorySectionsLoading.set(false);
          }
        },
        error: () => {
          if (--pending === 0) {
            this._categorySections.update((current) => ({ ...current, [categoryId]: sections }));
            this._categorySectionsLoading.set(false);
          }
        },
      });
    });
  }
}