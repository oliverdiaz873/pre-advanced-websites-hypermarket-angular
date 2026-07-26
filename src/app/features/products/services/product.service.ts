import { Injectable, signal } from '@angular/core';
import { products, categories } from '@data/index';
import { ProductUI } from '../models/product-ui.interface';
import { Product } from '@core/types/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<ProductUI[]>([]);
  private _productsLoading = signal(true);
  private _productDetailLoading = signal(true);
  private _categoriesLoading = signal(true);
  private _error = signal<string | null>(null);

  readonly products = this._products.asReadonly();
  readonly productsLoading = this._productsLoading.asReadonly();
  readonly productDetailLoading = this._productDetailLoading.asReadonly();
  readonly categoriesLoading = this._categoriesLoading.asReadonly();
  readonly error = this._error.asReadonly();

  private initialised = false;

  loadAll(): void {
    if (this.initialised) return;
    this.initialised = true;

    this._productsLoading.set(true);
    this._productDetailLoading.set(true);
    this._categoriesLoading.set(true);

    setTimeout(() => {
      const mapped: ProductUI[] = products.map(p => ({
        ...p,
        oldPrice: undefined,
        discountPercentage: undefined,
      }));
      this._products.set(mapped);
      this._productsLoading.set(false);
      this._productDetailLoading.set(false);
      this._categoriesLoading.set(false);
    }, 300);
  }

  getCategories() {
    return categories;
  }
}
