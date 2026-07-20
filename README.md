# Pre-Advanced Websites - Hypermarket Angular

Angular hypermarket storefront built with Angular Standalone Components, TypeScript, Angular Signals, @ngx-translate, Tailwind CSS, and local static catalog data.

## Documentation

Start with [docs/getting-started.md](docs/getting-started.md).

Core documentation:
- [Architecture](docs/ARCHITECTURE.md)
- [Folder Structure](docs/folder-structure.md)
- [Internationalization](docs/I18N_GUIDE.md)
- [Migration Plan](docs/MIGRATION_PLAN.md)
- [Migration Gaps Audit](docs/migration-gaps.md)
- [Documentation Migration Plan](docs/DOCS_MIGRATION_PLAN.md)

Features:
- [Cart](docs/features/cart.md)
- [Products](docs/features/products.md)
- [Search](docs/features/search.md)
- [Home](docs/features/home.md)

## Project Overview

The project is a frontend storefront application migrated from Next.js to Angular.

Product, category, offer, and product-detail data are currently stored in local TypeScript modules under `src/app/data/`.

There is no backend API, database, authentication system, checkout integration, or remote catalog service implemented at this time.

## Main Features

- Locale-aware translations with `@ngx-translate/core`.
- Home page with hero carousel, offers carousel, featured products, category banners, and about section.
- Product detail pages with dynamic SEO metadata and JSON-LD.
- Category pages built from local category and product data.
- Offers page with filtering and discount badges.
- Client-side search system with normalized text matching.
- Client-side cart using Angular Signals and `localStorage`.
- Contact form with client-side validation.
- Legal pages using translation content.
- Responsive desktop, tablet, and mobile navigation.

## Tech Stack

- Angular `21.2.0`
- TypeScript
- Angular Router
- Angular Standalone Components
- Angular Signals
- `@ngx-translate/core`
- Tailwind CSS `4.3.1`
- RxJS
- Vitest

## Project Structure

```text
src/
├── app/
│   ├── core/       # Singleton services, types, utils, i18n config
│   ├── data/       # Local catalog data (products, categories, etc.)
│   ├── features/   # Business feature modules (cart, home, offers, etc.)
│   ├── layouts/    # Layout components (shop-layout)
│   └── shared/     # Reusable UI components (skeleton, toast, etc.)
├── assets/
│   └── i18n/       # Translation JSON files (es.json, en.json)
└── styles.css      # Global styles
```

## Getting Started

```bash
npm install
npm start
```

Other commands:
```bash
ng serve
npm run build
npm test
```

## License

[LICENSE](LICENSE)
