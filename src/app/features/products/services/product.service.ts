import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/api/api.service';
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

  /** Categorías: permanecen en el data layer mock hasta F5.3. */
  getCategories(): unknown {
    return [];
  }
}