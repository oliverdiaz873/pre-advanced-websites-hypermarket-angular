export { products } from './products.data';
export type { Product } from '@core/types/product.interface';

export { categories, CATEGORY_DATA } from './categories.data';
export type { Category, Subcategory } from '@core/types/category.interface';

export { offersData, calculateDiscountPercentage } from './offers.data';
export type { OfferData } from './offers.data';

export { sectionSlugToProductCategoria, subcategorySlugFromHref } from './category-section-map.data';

export { productPageData } from './product-page-data.data';
export type { ProductPageData } from './product-page-data.data';

export { productById, offerProducts, productsByCategoryId, categorySections, relatedProducts } from './catalog.helpers';
export type { CategorySection } from './catalog.helpers';
