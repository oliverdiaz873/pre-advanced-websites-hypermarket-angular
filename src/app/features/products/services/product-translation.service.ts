import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUI } from '../models/product-ui.interface';
import { ProductPageData } from '@data/product-page-data.data';

/**
 * ProductTranslationService - Product i18n resolution with Overlay & Fallback pattern.
 *
 * Centralises product content translation (name, description, specs) by:
 * 1. Looking up the key `products.{id}.{field}` in ngx-translate i18n files.
 * 2. Falling back to the original product data (nombre, descripcion, detalles)
 *    when no translation exists.
 *
 * Equivalent to the Next.js useProductTranslation hook.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductTranslationService {
  private translate = inject(TranslateService);

  /** Translates the product name or falls back to product.nombre */
  getName(product?: ProductUI): string {
    const fallback = product?.nombre ?? this.translate.instant('common.product.not_found');

    if (!product?.id) return fallback;

    const key = `products.${product.id}.name`;
    return this.exists(key) ? this.translate.instant(key) : fallback;
  }

  /**
   * Translates the product description or falls back to pageData.descripcion.
   * If neither is available, generates a generic fallback using the product name.
   */
  getDescription(product?: ProductUI, pageData?: ProductPageData): string {
    const fallbackName = this.getName(product);

    if (!product?.id) {
      return `Disfruta de la mejor calidad con nuestro ${fallbackName}.`;
    }

    const key = `products.${product.id}.description`;
    return this.exists(key)
      ? this.translate.instant(key)
      : (pageData?.descripcion ?? `Disfruta de la mejor calidad con nuestro ${fallbackName}.`);
  }

  /** Translates the product specs array or falls back to pageData.detalles */
  getSpecs(product?: ProductUI, pageData?: ProductPageData): string[] {
    if (!product?.id) return pageData?.detalles ?? [];

    const key = `products.${product.id}.specs`;
    const translated = this.translate.instant(key);

    return translated !== key
      ? (translated as string[])
      : (pageData?.detalles ?? []);
  }

  private exists(key: string): boolean {
    return this.translate.instant(key) !== key;
  }
}
