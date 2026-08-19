import type { ApiCategory } from './api-types';
import type { Category } from '@core/types/category.interface';

/**
 * Mapper F5.3.1: ApiCategory (backend Express+MongoDB) → modelo UI del storefront.
 *
 * Decisiones F5.3.0/F5.3.1:
 * - `slug` es la identidad estable de navegación (el `id` backend no es fiable:
 *   seed `_id === slug`, API-created usa UUID).
 * - La UI no recibe `href` del backend; se deriva: `/category/{slug}` y, para
 *   subcategorías, `/category/{slug}/{sub.slug}`.
 * - `name` se renderiza vía i18n (`categories.{slug}` / `categories.sub.{slug}`)
 *   con fallback al `name` del backend.
 */
export function mapApiCategoryToCategory(api: ApiCategory): Category {
  return {
    id: api.slug,
    name: api.name,
    href: `/category/${api.slug}`,
    subcategories: api.subcategories.map((sub) => ({
      name: sub.name,
      href: `/category/${api.slug}/${sub.slug}`,
    })),
  };
}

export function mapApiCategoriesToCategories(api: ApiCategory[]): Category[] {
  return api.map(mapApiCategoryToCategory);
}
