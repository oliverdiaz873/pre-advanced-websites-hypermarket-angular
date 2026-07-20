# Products

## Status

Implemented.

## Overview

Products are implemented as local static catalog data rendered through Angular pages and feature components. There is no remote product API, database, or route handler.

## Product Architecture

```
Static data (data/)        Angular Components          Pipes / Services
                           |
products.data.ts  -------> ProductCardComponent
                           ProductGridComponent
                           ProductCarouselComponent
                           ProductDetailSectionComponent
                           |
product-page.data.ts ----> ProductTranslationService ---> @ngx-translate
                           ProductTranslatePipe
```

## Product Type

`ProductUI` is defined in `src/app/features/products/models/product-ui.interface.ts`.

Fields: `id`, `nombre`, `url`, `categoria`, `precio`, `precioTexto`, `imagen`, `unidad`, `oldPrice`, `discountPercentage`.

## Components

- `ProductCardComponent`: Reusable product card with optional offer badge and action slot.
- `ProductGridComponent`: Responsive grid layout for product listings.
- `ProductCarouselComponent`: Horizontal scrolling carousel with navigation.
- `ProductCarouselSectionComponent`: Carousel with title and action injection.
- `ProductDetailSectionComponent`: Full product detail layout (image, info, price, description).

## Internationalization

Products use an overlay-and-fallback translation pattern.

### ProductTranslatePipe

Location: `src/app/features/products/pipes/product-translate.pipe.ts`

A pure pipe that resolves product names:

```html
<h2>{{ product.id | productTranslate:product.nombre }}</h2>
```

Looks up `products.{id}.name` in i18n JSON; falls back to `product.nombre` when missing.

### ProductTranslationService

Location: `src/app/features/products/services/product-translation.service.ts`

Service that centralizes product content resolution:

- `getName(product)`: Returns translated name or `product.nombre`.
- `getDescription(product, pageData)`: Returns translated description, `pageData.descripcion`, or generated fallback.
- `getSpecs(product, pageData)`: Returns translated specs array, `pageData.detalles`, or empty array.

Translation JSON structure (`assets/i18n/*.json`):

```json
{
  "products": {
    "televisor_samsung_75_pulgadas": {
      "name": "Televisor Samsung 75 pulgadas",
      "description": "...",
      "specs": ["...", "..."]
    }
  }
}
```

## SEO

- Dynamic page title via `SeoService` using translated product name.
- JSON-LD structured data rendered for product detail pages (`ProductPage` with `@type: 'Product'`).
- Separate SEO metadata for each product route.

## Data Flow

### Product Detail

1. Route `product/:id` resolves in `app.routes.ts`.
2. `ProductPageComponent` reads `id` from `ActivatedRoute.paramMap`.
3. Product is looked up in `products.data.ts`.
4. Missing products redirect to the `**` catch-all (404).
5. `ProductTranslationService` resolves translated name, description, and specs.
6. SEO metadata is set via `SeoService`.
7. Related products are filtered from the same category.

### Category

1. Route `category/:id` resolves.
2. `CategoryPageComponent` loads category and its subcategories.
3. `category-section-map.data.ts` maps subcategory slugs to product category keys.
4. Products are grouped into `ProductCarouselSectionComponent` instances.

## Related Files

- `src/app/data/products.data.ts`
- `src/app/data/product-page.data.ts`
- `src/app/data/categories.data.ts`
- `src/app/data/category-section-map.data.ts`
- `src/app/features/products/models/product-ui.interface.ts`
- `src/app/features/products/mocks/product.mock.ts`
- `src/app/features/products/components/product-card/`
- `src/app/features/products/components/product-grid/`
- `src/app/features/products/components/product-carousel/`
- `src/app/features/products/components/product-detail-section/`
- `src/app/features/products/pipes/product-translate.pipe.ts`
- `src/app/features/products/services/product-translation.service.ts`
- `src/app/features/product/product-page.component.ts`
- `src/app/features/category/category-page.component.ts`
- `src/app/core/services/seo.service.ts`
