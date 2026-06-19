import { Product } from '@core/types/product.interface';
import { categories } from './categories.data';
import { calculateDiscountPercentage, offersData } from './offers.data';
import { products } from './products.data';
import { subcategorySlugFromHref } from './category-section-map.data';
import { ProductUI } from '@features/products/models/product-ui.interface';

export interface CategorySection {
  id: string;
  name: string;
  products: ProductUI[];
}

export const productById = (id: string): ProductUI | undefined => products.find(product => product.id === id);

export const offerProducts = (): ProductUI[] => offersData
  .map(offer => {
    const product = productById(offer.id);
    if (!product) return undefined;
    const discount = calculateDiscountPercentage(product.precio, offer.oldPrice);
    return {
      ...product,
      oldPrice: offer.oldPrice,
      badgeText: discount > 0 ? `-${discount}%` : 'Oferta'
    } satisfies ProductUI;
  })
  .filter(Boolean) as ProductUI[];

export const productsByCategoryId = (categoryId: string): ProductUI[] => {
  const category = categories.find(item => item.id === categoryId);
  if (!category) return [];
  const subcategoryIds = category.subcategories.map(item => subcategorySlugFromHref(item.href));
  return products.filter(product => subcategoryIds.includes(product.categoria));
};

export const categorySections = (categoryId: string): CategorySection[] => {
  const category = categories.find(item => item.id === categoryId);
  if (!category) return [];
  return category.subcategories.map(subcategory => {
    const id = subcategorySlugFromHref(subcategory.href);
    return {
      id,
      name: subcategory.name,
      products: products.filter(product => product.categoria === id)
    };
  });
};

export const relatedProducts = (product: Product, limit = 8): ProductUI[] => products
  .filter(item => item.categoria === product.categoria && item.id !== product.id)
  .slice(0, limit);
