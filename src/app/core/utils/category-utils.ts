import { TranslateService } from '@ngx-translate/core';
import { Category, Subcategory } from '@core/types/category.interface';
import { subcategorySlugFromHref } from '@data/category-section-map.data';

export function getCategoryName(
  category: Category,
  translate: TranslateService
): string {
  const key = `categories.${category.id}`;
  const translated = translate.instant(key);
  return translated !== key ? translated : category.name;
}

export function getSubcategoryName(
  subcategory: Subcategory,
  translate: TranslateService
): string {
  const slug = subcategorySlugFromHref(subcategory.href);
  const key = `categories.sub.${slug}`;
  const translated = translate.instant(key);
  return translated !== key ? translated : subcategory.name;
}
