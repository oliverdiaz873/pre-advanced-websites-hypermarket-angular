# PLAN DE MIGRACIÓN: Next.js → Angular

## Migration Status
**Status**: Completed

The Next.js → Angular migration has reached feature parity.

Completed:
- Foundation
- Types and static data
- Internationalization
- Shared UI components
- Layout and navigation
- Cart system
- Product system
- Search system
- Pages migration
- SEO implementation
- Visual parity refinement

---

## Hipermercado Superior — Migración Técnica Integral

**Proyecto origen**: `pre-advanced-websites-hypermarket-next`  
**Proyecto destino**: `pre-advanced-websites-hypermarket-angular`  
**Versión del documento**: 1.0  
**Fecha**: Junio 2026

---

## Tabla de Contenidos

1. [Inventario Completo del Proyecto](#1-inventario-completo-del-proyecto)
2. [Correspondencia Next.js ↔ Angular](#2-correspondencia-nextjs--angular)
3. [Arquitectura Angular Recomendada](#3-arquitectura-angular-recomendada)
4. [Fases de Migración Detalladas](#4-fases-de-migracion-detalladas)
5. [Identificación de Piezas Críticas](#5-identificacion-de-piezas-criticas)
6. [Riesgos y Mitigación](#6-riesgos-y-mitigacion)
7. [Orden de Implementación Paso a Paso](#7-orden-de-implementacion-paso-a-paso)

---

## 1. Inventario Completo del Proyecto

### 1.1 Metadatos del Proyecto

| Atributo | Valor |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| UI Layer | React 19.2.4 |
| Lenguaje | TypeScript ^5 |
| Estilos | Tailwind CSS v4 |
| Internacionalización | next-intl ^4.12.0 |
| Animaciones | framer-motion ^12.38.0 |
| API Backend | Ninguno (datos estáticos TypeScript) |
| Gestión de Estado | React Context + useState + localStorage |
| Fuentes | Domine (local, formato TTF) |

### 1.2 Mapa de Rutas (App Router)

```
/[locale]/(shop)/                           → Layout: CartProvider, Header, Footer, ScrollToTop
/[locale]/(shop)/page.tsx                   → Home (Server Component)
/[locale]/(shop)/loading.tsx                → Skeleton Home
/[locale]/(shop)/error.tsx                  → Error Boundary
/[locale]/(shop)/product/[id]/page.tsx      → Product Detail (Server Component + Client wrapper)
/[locale]/(shop)/product/[id]/loading.tsx   → Skeleton Producto
/[locale]/(shop)/category/[id]/page.tsx     → Category Page (Server Component + Client wrapper)
/[locale]/(shop)/category/[id]/loading.tsx  → Skeleton Categoría
/[locale]/(shop)/offers/page.tsx            → Offers (wrapper → OffersPageClient)
/[locale]/(shop)/offers/loading.tsx         → Skeleton Ofertas
/[locale]/(shop)/search/page.tsx            → Search (wrapper → SearchPageClient, query param)
/[locale]/(shop)/search/loading.tsx         → Skeleton Búsqueda
/[locale]/(shop)/cart/page.tsx              → Cart (wrapper → CartPageClient)
/[locale]/(shop)/cart/loading.tsx           → Skeleton Carrito
/[locale]/(shop)/contact/page.tsx           → Contact (wrapper → ContactPageClient)
/[locale]/(shop)/contact/loading.tsx        → Skeleton Contacto
/[locale]/(shop)/legal/terms/page.tsx       → Legal Terms (LegalPageClient con type="terms")
/[locale]/(shop)/legal/privacy/page.tsx     → Legal Privacy (LegalPageClient con type="privacy")
/[locale]/layout.tsx                        → Root Layout (NextIntlClientProvider, html lang, fonts)
```

### 1.3 Mapa de Componentes por Feature

#### Cart (`src/features/cart/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `CartContext.tsx` | Provider de carrito (Context + localStorage) | Cliente |
| `hooks/useCart.ts` | Hook de acceso al contexto | Hook |
| `components/AddToCartButton.tsx` | Botón "Agregar al carrito" con badge | Cliente |
| `components/CartHeader.tsx` | Encabezado del carrito con totales | Cliente |
| `components/CartItem.tsx` | Item individual del carrito | Cliente |
| `components/CartItemsList.tsx` | Lista de items del carrito | Cliente |
| `components/CartLayout.tsx` | Layout contenedor del carrito | Cliente |
| `components/CartSummary.tsx` | Resumen con total y checkout | Cliente |
| `components/EmptyCart.tsx` | Estado vacío del carrito | Cliente |
| `components/QuantityControls.tsx` | Controles +/− de cantidad | Cliente |
| `components/CartPageClient.tsx` | Página completa del carrito | Cliente |
| `index.ts` | Barrel exports | — |

#### Contact (`src/features/contact/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `hooks/useFormValidation.ts` | Validación de formulario de contacto | Hook |
| `components/ContactForm.tsx` | Formulario de contacto con validación | Cliente |
| `components/ContactPageClient.tsx` | Página de contacto completa | Cliente |

#### Home (`src/features/home/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `hooks/useScrollScale.ts` | Animación de escala basada en scroll | Hook |
| `hooks/useIsMobile.ts` | Detección de viewport móvil | Hook |
| `components/HeroCarousel.tsx` | Carrusel principal con auto-rotación | Cliente |
| `components/CategoryBannersSection.tsx` | Sección de banners por categoría | Cliente |
| `components/CategoryBanner.tsx` | Banner individual de categoría | Cliente |
| `components/AboutUs.tsx` | Sección "Sobre nosotros" | Cliente |
| `components/animations.ts` | Configuraciones de animación (framer-motion) | Utilidad |

#### Layout (`src/features/layout/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `components/Header.tsx` | Header principal con logo, nav, search, cart | Cliente |
| `components/Footer.tsx` | Footer con enlaces e info | Cliente |
| `components/LegalLayout.tsx` | Layout para páginas legales | Cliente |
| `index.ts` | Barrel exports | — |

#### Navigation (`src/features/navigation/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `hooks/useTabletMenu.ts` | Estado del menú tablet (abierto/cerrado) | Hook |
| `components/DesktopNav.tsx` | Navegación desktop horizontal | Cliente |
| `components/TabletNav.tsx` | Navegación tablet con menú hamburguesa | Cliente |
| `components/MobileNav.tsx` | Navegación móvil con drawer | Cliente |

#### Offers (`src/features/offers/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `hooks/useOfferFilters.ts` | Filtrado de ofertas por categoría | Hook |
| `components/OffersPageClient.tsx` | Página de ofertas completa | Cliente |
| `components/OfferFilters.tsx` | Filtros laterales de ofertas | Cliente |
| `components/OfferBadge.tsx` | Badge de descuento (−X%) | Cliente |
| `components/EmptyOffers.tsx` | Estado vacío de ofertas | Cliente |

#### Products (`src/features/products/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `hooks/useProductTranslation.ts` | Traducción overlay de productos | Hook |
| `components/ProductCard.tsx` | Tarjeta de producto (memoized, con slots) | Cliente |
| `components/ProductCarousel.tsx` | Carrusel horizontal de productos | Cliente |
| `components/ProductCarouselSection.tsx` | Sección carrusel con título y acciones | Cliente |
| `components/ProductDetailSection.tsx` | Detalle completo de producto | Cliente |
| `components/ProductGrid.tsx` | Grid responsivo de productos | Cliente |

#### Search (`src/features/search/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `hooks/useHeaderSearch.ts` | Lógica de búsqueda en header | Hook |
| `components/DesktopSearch.tsx` | Input de búsqueda para desktop | Cliente |
| `components/TabletSearch.tsx` | Input de búsqueda para tablet | Cliente |
| `components/MobileSearch.tsx` | Input de búsqueda para móvil | Cliente |
| `components/SearchPageClient.tsx` | Página de resultados de búsqueda | Cliente |
| `components/EmptySearchResults.tsx` | Estado sin resultados | Cliente |

#### Legal (`src/features/legal/`)

| Archivo | Rol | Tipo |
|---|---|---|
| `components/LegalPageClient.tsx` | Página legal genérica (terms/privacy) | Cliente |

### 1.4 Mapa de Componentes Compartidos (UI)

| Ruta | Componente | Descripción |
|---|---|---|
| `ui/Breadcrumb/` | Breadcrumb | Migas de pan navegacional |
| `ui/Drawer/` | Drawer | Panel lateral deslizable |
| `ui/EmptyState/` | EmptyState | Estado vacío genérico |
| `ui/Icons/` | Iconos SVG | Menu, Search, Close, Cart, ChevronLeft/Right, Social icons, Fire, Sliders |
| `ui/LanguageSelector/` | LanguageSelector | Selector de idioma es/en |
| `ui/ScrollToTop/` | ScrollToTop | Botón flotante para ir arriba |
| `ui/Skeleton/` | BaseSkeleton, HeroBannerSkeleton, CategoriesSkeleton, ProductsGridSkeleton, OfferCardSkeleton, ProductCardSkeleton | Esqueletos de carga |
| `ui/Toast/` | Toast | Notificación temporal |

### 1.5 Data Layer (Servicios Estáticos)

| Archivo | Contenido | Tamaño |
|---|---|---|
| `services/catalog/products.ts` | 184 productos con datos completos | ~184 registros |
| `services/catalog/categories.ts` | 8 categorías con ~30 subcategorías | ~93 líneas |
| `services/catalog/offers.ts` | 7 ofertas con cálculo de descuento | ~49 líneas |
| `services/catalog/productPageData.ts` | Contenido editorial para cada producto (descripciones extendidas) | ~2046 líneas |
| `services/catalog/categorySectionMap.ts` | Utilidades de mapeo slug → categoría | ~14 líneas |

### 1.6 Utilidades (Lib)

| Archivo | Función |
|---|---|
| `lib/assetUtils.ts` | `getAssetUrl(path)` — resuelve rutas de assets |
| `lib/priceUtils.ts` | `cleanPrice()`, `unitLabel()`, `formatProductPrice()` — formateo de precios |
| `lib/searchUtils.ts` | `normalizarTexto()`, `hasSearchQuery()`, `matchesSearchQuery()` — búsqueda sin acentos |
| `lib/index.ts` | Barrel exports |

### 1.7 Tipos

| Archivo | Interfaces |
|---|---|
| `types/product.ts` | `Product` (id, nombre, url, categoria, precio, precioTexto, imagen, unidad?) |
| `types/category.ts` | `Category`, `Subcategory` |

### 1.8 Internacionalización

| Archivo | Tamaño | Namespaces |
|---|---|---|
| `messages/es.json` | ~2529 líneas | categories, common, header, footer, home, search, offers, contact, legal, products (184 traducciones) |
| `messages/en.json` | ~2529 líneas | Misma estructura que es.json |

### 1.9 Assets Públicos

```
public/assets/
  fonts/Domine/
    domine-regular.ttf
    domine-medium.ttf
    domine-semibold.ttf
    domine-bold.ttf
  icons/favicons/        → iconos favicon
  images/
    banners/             → imágenes de banners promocionales
    categories/          → imágenes de categorías
    fondos/              → imágenes de fondo
    logo/                → logo de la marca
    productos/           → fotos de productos organizadas por categoría
```

### 1.10 Composición con Actions (Patrón Render Props)

Dentro de `src/app/[locale]/(shop)/_components/` existen dos componentes puente que inyectan `AddToCartButton` y `OfferBadge` mediante render props/slots:

| Archivo | Función |
|---|---|
| `ProductCarouselSectionWithActions.tsx` | Envuelve `ProductCarouselSection` con `AddToCartButton` y `OfferBadge` |
| `ProductDetailSectionWithActions.tsx` | Envuelve `ProductDetailSection` con `AddToCartButton` |
| `ProductPageClient.tsx` | Página cliente de detalle de producto, usa ambos wrappers |
| `CategoryPageClient.tsx` | Página cliente de categoría, usa `ProductCarouselSectionWithActions` |

---

## 2. Correspondencia Next.js ↔ Angular

| Concepto Next.js | Equivalente Angular | Notas |
|---|---|---|
| **App Router (`app/[locale]/(shop)/routes`)** | `RouterModule` con `routes` y lazy loading | Angular no tiene file-based routing; se configuran rutas en `app.routes.ts` |
| **Server Components (async pages)** | Componentes Angular estándar | Angular es SPA; no hay separación servidor/cliente. Los datos se cargan en servicios o resolvers |
| **Client Components (`"use client"`)** | Componentes Angular (todos son cliente por defecto) | Todos los componentes Angular son ejecutados en el navegador |
| **React Context (`CartContext`)** | Service + `BehaviorSubject` / `Signal` | Servicio singleton inyectable, con `BehaviorSubject` para reactividad |
| **next-intl (`useTranslations`, `getTranslations`)** | `@ngx-translate/core` + `TranslateService` | Carga de JSON, pipe `translate`, `TranslateService` |
| **framer-motion (`motion.div`)** | `@angular/animations` (`trigger`, `state`, `style`, `animate`) | Las animaciones se definen en el decorador `@Component` como metadatos |
| **next/font/local** | CSS `@font-face` en `styles.scss` | La fuente Domine TTF se declara globalmente |
| **`layout.tsx` (anidados)** | `RouterOutlet` anidado + child routes | Angular soporta jerarquía de outlets |
| **`loading.tsx`** | Estado `loading` en componente + skeletons | No hay equivalente automático; se maneja con señales/estado |
| **`error.tsx`** | `ErrorHandler` global + `ErrorState` component | Angular tiene `ErrorHandler` para capturar errores no controlados |
| **`generateMetadata`** | `Title` service + `Meta` service | Se inyectan en cada componente de página |
| **`sitemap.ts` / `robots.ts`** | Archivos estáticos `sitemap.xml`, `robots.txt` en `public/` | Angular no los genera dinámicamente; se sirven como estáticos |
| **`notFound()`** | Redirect a ruta 404 wildcard (`**`) | Se configura en las rutas: `{ path: '**', component: NotFoundComponent }` |
| **`redirect()`** | `Router.navigate()` | Equivalente directo |
| **`searchParams`** | `QueryParamMap` de `ActivatedRoute` | Angular provee `queryParamMap` como Observable |
| **`params` dinámicos `[id]`** | `:id` en la ruta Angular | Ej: `product/:id` |
| **Route Groups `(shop)`** | No equivalente directo | Se ignora; Angular usa outlets anidados |
| **React.memo** | `ChangeDetectionStrategy.OnPush` | Mecanismo equivalente de optimización de render |
| **Tailwind CSS v4** | Tailwind CSS v4 (misma herramienta) | Compatible directamente; instalar `tailwindcss` con PostCSS |
| **CSS co-located (`.css` junto al componente)** | Angular `styleUrls` o `:host` styles | Angular soporta estilos encapsulados por componente |
| **`index.ts` barrel exports** | `index.ts` barrel exports | Mismo patrón |
| **`dangerouslySetInnerHTML` (JSON-LD)** | `DomSanitizer.bypassSecurityTrustHtml` | Equivalente con sanitización explícita |
| **localStorage (carrito)** | `localStorage` API (mismo) | No hay cambio; igual en TypeScript |
| **Slots children** | `<ng-content>` | Proyección de contenido nativa |
| **Render Props (action/ badge)** | `@ContentChild` + `ng-template` o inputs de tipo `TemplateRef` | Patrón equivalente con templates tipados |

---

## 3. Arquitectura Angular Recomendada

### 3.1 Stack Tecnológico

| Herramienta | Versión / Opción |
|---|---|
| Angular CLI | 17+ (standalone APIs) |
| Angular Framework | 17+ (standalone components, sin NgModules) |
| TypeScript | ^5 |
| Tailwind CSS | v4 |
| @ngx-translate/core | Última estable |
| @angular/animations | Incluido en Angular |
| RxJS | Incluido en Angular |
| Angular Signals | Angular 17+ (opcional para estado simple) |

### 3.2 Principios Arquitectónicos

1. **Standalone Components**: 100% standalone, sin `NgModule`. Usar `bootstrapApplication` y `provideRouter`.
2. **Feature-based Organization**: Cada feature replica la estructura del Next.js original.
3. **Lazy Loading**: Cada sección principal (home, product, category, offers, search, cart, contact, legal) carga lazy.
4. **ChangeDetectionStrategy.OnPush** en componentes de presentación (ProductCard, CartItem, etc.).
5. **Servicios singleton** para estado global (carrito, i18n).
6. **Sin Redux** — mantener la simplicidad con servicios + BehaviorSubject/Signals.
7. **Barrel exports** (`index.ts`) por feature para imports limpios.

### 3.3 Estructura de Carpetas Propuesta

```
src/
├── app/
│   ├── app.component.ts                 # Root component (html lang, font class)
│   ├── app.config.ts                    # provideRouter, provideHttpClient, etc.
│   ├── app.routes.ts                    # Definición de rutas principal
│   │
│   ├── pages/                           # Lazy-loaded route components
│   │   ├── home/
│   │   │   ├── home-page.component.ts
│   │   │   └── home.routes.ts
│   │   ├── product/
│   │   │   ├── product-page.component.ts
│   │   │   ├── product-page-client.component.ts
│   │   │   └── product.routes.ts
│   │   ├── category/
│   │   │   ├── category-page.component.ts
│   │   │   ├── category-page-client.component.ts
│   │   │   └── category.routes.ts
│   │   ├── offers/
│   │   │   ├── offers-page-client.component.ts
│   │   │   └── offers.routes.ts
│   │   ├── search/
│   │   │   ├── search-page-client.component.ts
│   │   │   └── search.routes.ts
│   │   ├── cart/
│   │   │   ├── cart-page-client.component.ts
│   │   │   └── cart.routes.ts
│   │   ├── contact/
│   │   │   ├── contact-page-client.component.ts
│   │   │   └── contact.routes.ts
│   │   └── legal/
│   │       ├── legal-page-client.component.ts
│   │       └── legal.routes.ts
│   │
│   └── layouts/
│       ├── shop-layout/
│       │   ├── shop-layout.component.ts    # CartProvider wrapper, Header, Footer, ScrollToTop
│       │   └── shop-layout.routes.ts       # Child routes for shop section
│       └── root-layout/
│           └── root-layout.component.ts    # (opcional: html/body setup)
│
├── core/
│   ├── services/
│   │   ├── cart.service.ts              # Carrito con BehaviorSubject + localStorage
│   │   ├── seo.service.ts               # Title + Meta helper
│   │   └── error-handler.service.ts     # ErrorHandler global
│   ├── i18n/
│   │   └── i18n.config.ts               # Configuración de @ngx-translate
│   ├── types/
│   │   ├── product.interface.ts         # Product interface
│   │   └── category.interface.ts        # Category, Subcategory interfaces
│   └── utils/
│       ├── asset-utils.ts               # getAssetUrl()
│       ├── price-utils.ts               # cleanPrice(), unitLabel(), formatProductPrice()
│       └── search-utils.ts              # normalizarTexto(), hasSearchQuery(), matchesSearchQuery()
│
├── data/
│   ├── products.data.ts                 # 184 productos (copia de services/catalog/products.ts)
│   ├── categories.data.ts               # 8 categorías (copia de services/catalog/categories.ts)
│   ├── offers.data.ts                   # 7 ofertas (copia de services/catalog/offers.ts)
│   ├── product-page-data.data.ts        # ~2046 líneas contenido editorial
│   └── category-section-map.data.ts     # Utilidades de mapeo slug
│
├── features/
│   ├── cart/
│   │   ├── components/
│   │   │   ├── add-to-cart-button.component.ts
│   │   │   ├── cart-header.component.ts
│   │   │   ├── cart-item.component.ts
│   │   │   ├── cart-items-list.component.ts
│   │   │   ├── cart-layout.component.ts
│   │   │   ├── cart-summary.component.ts
│   │   │   ├── empty-cart.component.ts
│   │   │   └── quantity-controls.component.ts
│   │   └── index.ts
│   ├── contact/
│   │   ├── components/
│   │   │   ├── contact-form.component.ts
│   │   │   └── contact-page-client.component.ts
│   │   ├── validators/
│   │   │   └── form-validators.ts         # Lógica de validación (reemplaza useFormValidation)
│   │   └── index.ts
│   ├── home/
│   │   ├── components/
│   │   │   ├── hero-carousel.component.ts
│   │   │   ├── category-banners-section.component.ts
│   │   │   ├── category-banner.component.ts
│   │   │   ├── about-us.component.ts
│   │   │   └── animations.ts              # Config de animaciones Angular
│   │   ├── directives/
│   │   │   ├── scroll-scale.directive.ts   # Reemplaza useScrollScale
│   │   │   └── is-mobile.directive.ts      # Reemplaza useIsMobile
│   │   └── index.ts
│   ├── layout/
│   │   ├── components/
│   │   │   ├── header.component.ts
│   │   │   ├── footer.component.ts
│   │   │   └── legal-layout.component.ts
│   │   └── index.ts
│   ├── legal/
│   │   └── components/
│   │       └── legal-page-client.component.ts
│   ├── navigation/
│   │   ├── components/
│   │   │   ├── desktop-nav.component.ts
│   │   │   ├── tablet-nav.component.ts
│   │   │   └── mobile-nav.component.ts
│   │   └── services/
│   │       └── tablet-menu.service.ts     # Reemplaza useTabletMenu
│   ├── offers/
│   │   ├── components/
│   │   │   ├── offers-page-client.component.ts
│   │   │   ├── offer-filters.component.ts
│   │   │   ├── offer-badge.component.ts
│   │   │   └── empty-offers.component.ts
│   │   └── services/
│   │       └── offer-filters.service.ts   # Reemplaza useOfferFilters
│   ├── products/
│   │   ├── components/
│   │   │   ├── product-card.component.ts
│   │   │   ├── product-carousel.component.ts
│   │   │   ├── product-carousel-section.component.ts
│   │   │   ├── product-detail-section.component.ts
│   │   │   └── product-grid.component.ts
│   │   ├── pipes/
│   │   │   └── product-translate.pipe.ts  # Reemplaza useProductTranslation
│   │   └── index.ts
│   └── search/
│       ├── components/
│       │   ├── desktop-search.component.ts
│       │   ├── tablet-search.component.ts
│       │   ├── mobile-search.component.ts
│       │   ├── search-page-client.component.ts
│       │   └── empty-search-results.component.ts
│       └── services/
│           └── header-search.service.ts   # Reemplaza useHeaderSearch
│
├── shared/
│   ├── components/
│   │   ├── breadcrumb/
│   │   │   ├── breadcrumb.component.ts
│   │   │   └── index.ts
│   │   ├── drawer/
│   │   │   ├── drawer.component.ts
│   │   │   └── index.ts
│   │   ├── empty-state/
│   │   │   ├── empty-state.component.ts
│   │   │   └── index.ts
│   │   ├── icons/
│   │   │   ├── icons.component.ts         # SVG icons como componentes inline
│   │   │   └── index.ts
│   │   ├── language-selector/
│   │   │   ├── language-selector.component.ts
│   │   │   └── index.ts
│   │   ├── scroll-to-top/
│   │   │   ├── scroll-to-top.component.ts
│   │   │   └── index.ts
│   │   ├── skeleton/
│   │   │   ├── base-skeleton.component.ts
│   │   │   ├── hero-banner-skeleton.component.ts
│   │   │   ├── categories-skeleton.component.ts
│   │   │   ├── products-grid-skeleton.component.ts
│   │   │   ├── offer-card-skeleton.component.ts
│   │   │   ├── product-card-skeleton.component.ts
│   │   │   └── index.ts
│   │   └── toast/
│   │       ├── toast.component.ts
│   │       ├── toast.service.ts
│   │       └── index.ts
│   └── pipes/
│       └── index.ts
│
├── assets/                              # Static assets (copia de public/)
│   ├── fonts/Domine/                    # Archivos .ttf de la fuente Domine
│   ├── icons/favicons/                  # Favicons
│   └── images/                          # banners, categories, fondos, logo, productos/
│
└── styles/
    ├── styles.scss                      # Global styles (Tailwind directives, @font-face, :root)
    └── globals.css                      # Copia de globals.css (o integrado en styles.scss)
```

### 3.4 Esquema de Rutas Angular

```typescript
// app.routes.ts (ejemplo conceptual)
const routes: Routes = [
  {
    path: '',
    component: ShopLayoutComponent,       // Header, Footer, CartProvider
    children: [
      { path: '', loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent) },
      { path: 'product/:id', loadChildren: () => import('./pages/product/product.routes') },
      { path: 'category/:id', loadChildren: () => import('./pages/category/category.routes') },
      { path: 'offers', loadComponent: () => import('./pages/offers/offers-page-client.component').then(m => m.OffersPageClientComponent) },
      { path: 'search', loadComponent: () => import('./pages/search/search-page-client.component').then(m => m.SearchPageClientComponent) },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart-page-client.component').then(m => m.CartPageClientComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact-page-client.component').then(m => m.ContactPageClientComponent) },
      { path: 'legal/terms', loadComponent: () => import('./pages/legal/legal-page-client.component').then(m => m.LegalPageClientComponent) },
      { path: 'legal/privacy', loadComponent: () => import('./pages/legal/legal-page-client.component').then(m => m.LegalPageClientComponent) },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
```

### 3.5 Mecanismo de Traducción Overlay

El patrón "overlay & fallback" del Next.js original se replica así:

- **Traducciones directas** (títulos, descripciones de UI): `TranslateService.get('namespace.key')` con pipe `translate`.
- **Traducciones overlay de productos**: El pipe `ProductTranslatePipe` recibe un `productId` y un `fallback` (nombre original). Intenta `'products.{id}.name'`; si no existe, retorna el fallback.
- Los JSON de idioma (`assets/i18n/es.json`, `assets/i18n/en.json`) son copia directa de los `messages/*.json`.
- El `TranslateHttpLoader` carga los JSON desde `assets/i18n/`.

---

## 4. Fases de Migración Detalladas

### Fase 1: Fundación del Proyecto Angular

**Objetivo**: Inicializar el proyecto Angular con todas las herramientas base y verificar que la configuración compila correctamente.

**Actividades**:
1. Crear proyecto con `ng new` (standalone: true, routing: true, styles: SCSS).
2. Instalar dependencias: `@ngx-translate/core`, `@ngx-translate/http-loader`, `tailwindcss v4`.
3. Configurar Tailwind CSS v4 (similar al original: `@import "tailwindcss"`, `@theme` directive).
4. Configurar TypeScript paths en `tsconfig.json` (aliases: `@/core/*`, `@/data/*`, `@/features/*`, `@/shared/*`, etc.).
5. Configurar `app.config.ts` con `provideRouter`, `provideHttpClient`, `provideAnimations`.
6. Copiar `public/assets/` → `src/assets/`.
7. Configurar `@font-face` en `styles.scss` para la familia Domine (4 pesos).
8. Configurar `app.component.ts` con la clase de fuente CSS (variable `--font-family-brand`).
9. Verificar compilación con `ng serve`.

**Dependencias**: Ninguna.

---

### Fase 2: Tipos, Datos Estáticos e i18n

**Objetivo**: Migrar todas las interfaces TypeScript, los datos estáticos y el sistema de internacionalización.

**Actividades**:
1. Crear `core/types/product.interface.ts` y `core/types/category.interface.ts`.
2. Crear `data/products.data.ts` — copiar array de 184 productos.
3. Crear `data/categories.data.ts` — copiar array de 8 categorías.
4. Crear `data/offers.data.ts` con interfaz `OfferData` y función `calculateDiscountPercentage`.
5. Crear `data/product-page-data.data.ts` — copiar ~2046 líneas de contenido editorial.
6. Crear `data/category-section-map.data.ts` — funciones `sectionSlugToProductCategoria` y `subcategorySlugFromHref`.
7. Copiar `messages/es.json` → `src/assets/i18n/es.json`.
8. Copiar `messages/en.json` → `src/assets/i18n/en.json`.
9. Configurar `TranslateModule.forRoot` con `TranslateHttpLoader` apuntando a `assets/i18n/`.
10. Crear `core/i18n/i18n.config.ts` con factoría de loader.
11. Verificar carga de traducciones en consola.

**Dependencias**: Fase 1.

---

### Fase 3: Utilidades Compartidas

**Objetivo**: Migrar todas las funciones utilitarias (asset resolution, price formatting, search normalization).

**Actividades**:
1. Crear `core/utils/asset-utils.ts` — función `getAssetUrl(path)`.
2. Crear `core/utils/price-utils.ts` — funciones `cleanPrice()`, `unitLabel()`, `formatProductPrice()`.
3. Crear `core/utils/search-utils.ts` — funciones `normalizarTexto()`, `hasSearchQuery()`, `matchesSearchQuery()`.
4. Crear barrel export `core/utils/index.ts`.

**Dependencias**: Fase 2.

---

### Fase 4: Componentes Compartidos UI

**Objetivo**: Migrar todos los componentes de la capa `ui/` al directorio `shared/components/`.

**Actividades**:
1. **Breadcrumb**: Componente standalone con `@Input()` items. Reemplazar el `BreadcrumbItem` de Next.js con interfaz Angular.
2. **Drawer**: Componente standalone con `@Input() isOpen`, `@Output() onClose`, `@Input() title`. Usar animaciones Angular (`@angular/animations`) para la transición de entrada/salida.
3. **EmptyState**: Componente standalone con `@Input() icon`, `@Input() title`, `@Input() message`. Proyección de contenido con `<ng-content>` para acciones.
4. **Icons**: Componente(s) standalone que renderizan SVGs inline. Cada icono puede ser un componente independiente o un selector unificado con `@Input() name`.
5. **LanguageSelector**: Componente standalone con botón de cambio de idioma. Usa `TranslateService.use()`.
6. **ScrollToTop**: Componente standalone con botón flotante. Escucha scroll event y muestra/oculta con animación.
7. **Skeleton**: Seis componentes standalone para cada variante de esqueleto (BaseSkeleton, HeroBannerSkeleton, CategoriesSkeleton, ProductsGridSkeleton, OfferCardSkeleton, ProductCardSkeleton). Inputs para personalizar dimensiones.
8. **Toast**: Componente standalone + `ToastService` (inyectable). El servicio maneja una cola de notificaciones; el componente se suscribe a la cola y muestra/oculta con animación.
9. Actualizar barrel `shared/components/index.ts`.
10. Verificar todos los componentes en aislamiento.

**Dependencias**: Fase 2 (tipos), Fase 3 (utilidades).

---

### Fase 5: Layout y Navegación

**Objetivo**: Migrar Header, Footer, LegalLayout y los tres sistemas de navegación (Desktop, Tablet, Mobile).

**Actividades**:
1. **Footer**: Copiar estructura JSX a template Angular, reemplazar `useTranslations` por `TranslateService` o pipe `translate`. CSS co-located.
2. **LegalLayout**: Componente standalone con `<ng-content>` para el contenido legal.
3. **TabletMenuService**: Servicio inyectable con `BehaviorSubject<boolean>` para el estado del menú tablet (abierto/cerrado). Reemplaza `useTabletMenu`.
4. **DesktopNav**: Componente standalone. Renderiza categorías como links horizontales. Usa `RouterLink` en lugar de `Link` de next-intl. Depende de `categories.data.ts`.
5. **TabletNav**: Componente standalone con menú hamburguesa. Usa `TabletMenuService`. Drawer lateral con la lista de categorías.
6. **MobileNav**: Componente standalone con menú inferior o drawer. Links principales + categorías colapsables.
7. **Header**: Componente standalone que compone el logo, `DesktopNav`, `TabletNav`, `MobileNav`, los search components, el `LanguageSelector`, y el icono de carrito con badge de contador. Se suscribe a `CartService` para el badge.
8. Migrar estilos CSS co-located a `styleUrls` o estilos inline (según preferencia).

**Dependencias**: Fase 4 (UI components: Drawer, Icons, LanguageSelector).

---

### Fase 6: Servicio de Carrito (Cart State Management)

**Objetivo**: Reemplazar `CartContext` con un servicio Angular reactivo.

**Actividades**:
1. Crear `core/services/cart.service.ts`:
   - `BehaviorSubject<CartItem[]>` para el estado del carrito.
   - Exponer `cart$`, `totalItems$`, `totalPrice$` como observables.
   - Métodos: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`.
   - Persistencia en `localStorage` con key `'carrito'`.
   - Hidratación inicial desde `localStorage` en el constructor.
   - Cálculo de `discountPercentage` idéntico al original.
   - Interfaz `CartItem` idéntica a la original.
2. Proveer el servicio como `providedIn: 'root'` (singleton global).
3. Crear `features/cart/components/`:
   - **AddToCartButton**: Input `product`, llama `cartService.addToCart()`. Muestra badge de confirmación temporal.
   - **CartHeader**: Input `totalItems`.
   - **CartItem**: Input `item`, Outputs `updateQuantity`, `removeFromCart`. `OnPush` strategy.
   - **CartItemsList**: Input `cart` array, outputs para eventos. Usa `*ngFor` con trackBy.
   - **CartLayout**: Componente contenedor con `<ng-content>`.
   - **CartSummary**: Se suscribe a `cart$` y `totalPrice$`, muestra resumen.
   - **EmptyCart**: Componente de estado vacío.
   - **QuantityControls**: Inputs `cantidad`, Output `change`. Botones +/−.
4. Migrar estilos CSS co-located.

**Dependencias**: Fase 2 (tipos), Fase 3 (price-utils).

---

### Fase 7: Productos y Búsqueda

**Objetivo**: Migrar components de productos (card, carrusel, grid, detalle) y el sistema de búsqueda.

**Actividades**:

**Productos**:
1. **ProductTranslatePipe**: Pipe puro standalone. Toma `productId` y `fallback`. Usa `TranslateService.get()` con key `'products.{id}.name'`. Si no existe, retorna `fallback`.
2. **ProductCard**: Componente standalone con `ChangeDetectionStrategy.OnPush`. Inputs: `product`, `isOffer`, `oldPrice`, `discountPercentage`. Templates para `badge` y `action` (contenido proyectado o `@Input()` TemplateRef). Responsive: ajusta diseño según viewport. Usa `ProductTranslatePipe` para el nombre.
3. **ProductCarousel**: Componente standalone con scroll horizontal nativo (overflow-x auto + snap). Botones de navegación ChevronLeft/ChevronRight. Auto-scroll opcional.
4. **ProductCarouselSection**: Componente standalone que combina título + `ProductCarousel` + acciones. Inputs: `title`, `products`, `badgeTemplate`, `actionTemplate`.
5. **ProductDetailSection**: Componente standalone con layout de detalle (imagen, info, precio, descripción extendida). Input: `product`, `pageData`, `actionTemplate`.
6. **ProductGrid**: Componente standalone con grid responsivo (Tailwind grid). Input: `products`, `badgeTemplate`, `actionTemplate`.

**Búsqueda**:
1. **HeaderSearchService**: Servicio inyectable con `BehaviorSubject<string>` para query de búsqueda.
2. **DesktopSearch**: Input visible en header. Escritura con debounce. Navegación por teclado (Escape para cerrar, Enter para navegar).
3. **TabletSearch**: Similar a DesktopSearch pero con toggle de visibilidad.
4. **MobileSearch**: Similar a TabletSearch, adaptado a pantallas pequeñas.
5. **SearchPageClient**: Página de resultados. Lee `query` de `ActivatedRoute.queryParamMap`. Filtra productos en tiempo real usando `normalizarTexto()`. Traducción overlay con `ProductTranslatePipe`. Muestra `ProductGrid` con resultados o `EmptySearchResults`.
6. **EmptySearchResults**: Componente de estado sin resultados.

**Puentes de composición** (reemplazan `_components/`):
1. **ProductCarouselSectionWithActions**: Función/componente helper que inyecta `AddToCartButton` y `OfferBadge` en `ProductCarouselSection`.
2. **ProductDetailSectionWithActions**: Helper que inyecta `AddToCartButton` en `ProductDetailSection`.

**Dependencias**: Fase 4 (UI: icons), Fase 5 (Header), Fase 6 (cart service), Fase 2 (data).

---

### Fase 8: Páginas Principales (Pages)

**Objetivo**: Migrar todas las páginas (Home, Product, Category, Offers, Cart, Contact, Legal) como componentes lazy-loaded.

**Actividades**:

**Home**:
1. Crear `home.routes.ts` con ruta vacía y carga lazy.
2. Crear `home-page.component.ts`:
   - Inyecta `TranslateService` para el SEO (Title + Meta).
   - Inyecta `categories.data.ts`, `products.data.ts`, `offers.data.ts`.
   - Renderiza: `HeroCarousel`, `ProductCarouselSectionWithActions` (ofertas), `ProductCarouselSectionWithActions` (destacados), `CategoryBannersSection`, `AboutUs`.
   - Incluye JSON-LD con `DomSanitizer`.

**Product Detail**:
1. Crear `product.routes.ts` con ruta `:id`.
2. Crear `product-page.component.ts`:
   - Lee `id` de `ActivatedRoute.paramMap`.
   - Busca producto en `products.data.ts`.
   - NotFound → redirect.
   - Renderiza `ProductDetailSectionWithActions` + `ProductCarouselSectionWithActions` (relacionados).
   - JSON-LD de producto.
   - SEO: Title + Meta dinámicos.

**Category**:
1. Crear `category.routes.ts` con ruta `:id`.
2. Crear `category-page.component.ts`:
   - Lee `id`, busca categoría, carga productos, organiza por subcategorías.
   - Renderiza secciones con `ProductCarouselSectionWithActions`.
   - JSON-LD de CollectionPage.

**Offers**:
1. Crear `offers.routes.ts`.
2. Migrar `OffersPageClient`:
   - `OfferFiltersService`: Reemplaza `useOfferFilters`. Servicio con `BehaviorSubject` para filtro por categoría. Expone `offerProducts$`, `filteredProducts$`, `sortedProducts$`.
   - `OfferFilters`: Componente standalone con lista de categorías y contadores. Inputs reactive.
   - `OfferBadge`: Muestra badge `-X%`.
   - Página: Filtros en sidebar (desktop) / Drawer (mobile).

**Cart**:
1. Crear `cart.routes.ts`.
2. Migrar `CartPageClient`: suscribe a `CartService`, muestra layout con items o EmptyCart.

**Contact**:
1. Crear `contact.routes.ts`.
2. Migrar `ContactPageClient`:
   - `FormValidators`: Reemplaza `useFormValidation`. Funciones de validación para email, teléfono, required.
   - `ContactForm`: Usa `FormBuilder` y `Validators` de Angular Reactive Forms.

**Legal**:
1. Crear `legal.routes.ts`.
2. Migrar `LegalPageClient`: Input `type` ('terms' | 'privacy'), muestra contenido traducido.

**Search**:
1. Crear `search.routes.ts`.
2. Migrar `SearchPageClient`: Lee query param, filtra productos.

**Dependencias**: Fase 5 (layout), Fase 6 (cart), Fase 7 (products, search).

---

### Fase 9: Animaciones, SEO y Polish

**Objetivo**: Migrar animaciones de framer-motion a Angular Animations, implementar SEO dinámico, y realizar ajustes finales.

**Actividades**:

**SEO**:
1. Crear `core/services/seo.service.ts`:
    - Método `setPageTitle(title: string, template?: boolean)` — usa `Title` service.
    - Método `setMetaTags(tags: { name: string, content: string }[])` — usa `Meta` service.
    - Método `setJsonLd(json: object)` — inyecta script type="application/ld+json" con `DomSanitizer`.
2. Implementar `CanActivate` o resolver en cada ruta para establecer metadata antes de cargar el componente.
3. Migrar `robots.ts` → archivo estático `src/robots.txt`.
4. Migrar `sitemap.ts` → archivo estático `src/sitemap.xml`.

**Polish**:
1. Skeleton screens: Implementar loading state en cada página usando los componentes Skeleton.
2. Error handling: Crear `ErrorHandler` global que capture errores no controlados y muestre un componente de error amigable.
3. ScrollToTop en navegación entre rutas (usar `Router.events`).
4. Responsive verification en todos los viewports.
5. Sweet alerts / Toasts para feedback de acciones (carrito, formulario).

**Dependencias**: Todas las fases anteriores.

---

### Fase 9B: Paridad Visual (Visual Parity)

**Objetivo**: Alcanzar fidelidad visual equivalente con el proyecto Next.js original en todos los componentes visibles.

**Actividades**:

**Home - HeroCarousel**:
1. Crear `HeroCarouselComponent` standalone con:
   - 3 banners (fruits/vegetables, iPhone, wine) con rutas responsive (`desktopImage`/`mobileImage`).
   - Auto-rotación cada 5s con `setInterval`, pausa en hover.
   - Touch swipe: eventos `touchstart`/`touchend` con threshold 50px.
   - Botones prev/next: visibles en desktop (`lg:flex`), ocultos en mobile.
   - Indicadores (dots): bottom-4, estilo `bg-white/50`, activo `bg-white scale-125 w-4`.
   - Imagen responsive: `< 640px` usa mobileImage.
   - Transición CSS: `transition-transform duration-700 ease-in-out`.

**Home - CategoryBannersSection**:
1. Crear `CategoryBannersSectionComponent` standalone con 8 categorías (alimentos, electrodomesticos, tecnologia, ropa, muebles, farmacia, ferreteria, juguetes).
2. Cada banner tiene: gradientFrom/gradientTo, accentColor, imageSrc, titleKey, descriptionKey, href.
3. Efectos visuales:
   - Fondo gradient con orbs decorativos (blur).
   - Imagen flotante: animación CSS `@keyframes float` (y: 0→-12→0, rotate: 0→1.5→0).
   - Hover: card translateY(-4px), box-shadow incrementado, CTA translateX(3px).
   - Layout alternado: `flex-direction: row` / `row-reverse` según índice.
   - Responsive: padding, font-size, image size escalan con viewport.
4. Animación scroll: usar directiva `appScrollAnimate` con fade + slide up.

**Home - AboutUs**:
1. Crear `AboutUsComponent` standalone con:
   - Sección oscura (`bg-black text-white`), border-radius 20px.
   - Layout flex: imagen (250px→450px) + texto (h2 + p).
