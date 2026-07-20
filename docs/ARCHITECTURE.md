# Architecture

## Overview

Hypermarket Angular uses a feature-based architecture with Angular Standalone Components.

The project is organized into:
- core: Application-wide services and utilities
- data: Local catalog data
- features: Business features and UI modules

---

## Angular Patterns

### Standalone Components
All components use Angular standalone architecture.

Benefits:
- No NgModules required
- Better lazy loading support
- Reduced boilerplate

### Signals State Management
Reactive state is managed using Angular Signals.

Example:
CartService
├── WritableSignal (cartItems)
├── computed signals (totalItems, totalPrice)
└── effects (localStorage persistence)

---

## Routing
The application uses Angular Router.

Main routes:
```
/
├── /category/:id
├── /product/:id
├── /offers
├── /cart
├── /contact
├── /legal/*
└── /not-found
```

---

## Detailed Structure

### core/
Purpose: Contains reusable, singleton code used across the entire application. Must not depend on any feature.

- services/: Singleton services (CartService, SeoService, ViewportService)
- types/: Global TypeScript interfaces (Product, Category, etc.)
- utils/: Pure utility functions (asset-utils, price-utils, search-utils)
- i18n/: Internationalization configuration (@ngx-translate)

### data/
Purpose: Stores all static application data (no external API).

- products.data.ts: Product catalog
- categories.data.ts: Categories and subcategories
- offers.data.ts: Offer products
- product-page.data.ts: Editorial content for product detail pages
- catalog.helpers.ts: Catalog helper functions

### features/
Purpose: Self-contained business modules, organized by feature.

Existing features:
- cart/: Shopping cart
- category/: Category pages
- contact/: Contact form
- home/: Homepage (HeroCarousel, CategoryBanners, AboutUs)
- layout/: Layout components (Header, Footer, LegalLayout)
- legal/: Legal pages (terms, privacy)
- navigation/: Responsive navigation
- not-found/: 404 page
- offers/: Offers page with filters
- product/: Product detail page
- products/: Reusable product components
- search/: Product search system
