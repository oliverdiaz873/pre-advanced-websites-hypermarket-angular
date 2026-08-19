import { mapApiCategoryToCategory, mapApiCategoriesToCategories } from './category.mapper';
import { ApiCategory } from './api-types';

describe('category.mapper', () => {
  const apiCategory: ApiCategory = {
    id: 'alimentos',
    name: 'Alimentos',
    slug: 'alimentos',
    subcategories: [
      { name: 'Bebidas', slug: 'bebidas' },
      { name: 'Frutas y Verduras', slug: 'frutas-y-verduras' },
    ],
  };

  it('usa slug como identidad de navegación y deriva hrefs', () => {
    const category = mapApiCategoryToCategory(apiCategory);

    expect(category.id).toBe('alimentos');
    expect(category.name).toBe('Alimentos');
    expect(category.href).toBe('/category/alimentos');
    expect(category.subcategories[0]).toEqual({
      name: 'Bebidas',
      href: '/category/alimentos/bebidas',
    });
    expect(category.subcategories[1].href).toBe('/category/alimentos/frutas-y-verduras');
  });

  it('nunca usa el id backend como identidad de navegación', () => {
    const apiWithUuid: ApiCategory = {
      ...apiCategory,
      id: 'random-uuid-not-navigable',
    };
    const category = mapApiCategoryToCategory(apiWithUuid);
    expect(category.id).toBe('alimentos');
    expect(category.href).toBe('/category/alimentos');
  });

  it('mapea listas completas preservando el orden', () => {
    const categories = mapApiCategoriesToCategories([apiCategory]);
    expect(categories).toHaveLength(1);
    expect(categories[0].subcategories).toHaveLength(2);
  });
});