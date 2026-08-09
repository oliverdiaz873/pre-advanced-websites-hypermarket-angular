import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUI } from '../models/product-ui.interface';
import { ProductPageData } from '@data/product-page.data';

/**
 * ProductTranslationService - Product i18n resolution with Overlay & Fallback pattern.
 *
 * Centralises product content translation (name, description, specs) by:
 * 1. Looking up the key `products.{id}.{field}` in ngx-translate i18n files.
 * 2. Falling back to the original product data (name, description, detalles)
 *    when no translation exists.
 *
 * Equivalent to the Next.js useProductTranslation hook.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductTranslationService {
  private translate = inject(TranslateService);

  /** Translates the product name or falls back to product.name */
  getName(product?: ProductUI): string {
    // F5.2: el backend ya localiza `name` con ?lang=; el nombre es la fuente.
    return product?.name ?? this.translate.instant('common.product.not_found');
  }

  /**
   * Translates the product description. F5.2: `description` ya viene localizada
   * del backend. Si no existe, utiliza pageData.description o un fallback genérico.
   */
  getDescription(product?: ProductUI, pageData?: ProductPageData): string {
    const fallbackName = this.getName(product);

    if (product?.description) {
      return product.description;
    }

    return (
      pageData?.description ??
      `Disfruta de la mejor calidad con nuestro ${fallbackName}.`
    );
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
