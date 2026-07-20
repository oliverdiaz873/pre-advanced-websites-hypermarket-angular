# Home

## Status

Implemented.

## Overview

The home feature renders the storefront landing experience. It combines a hero carousel, offers carousel, featured product carousel, category banners, and an about section.

## Sections

- **HeroCarousel**: Full-width rotating banner with promotions.
- **OffersCarousel**: Product carousel showing discounted products.
- **FeaturedProducts**: Curated product selection carousel.
- **CategoryBannersSection**: Eight category cards with gradient backgrounds.
- **AboutUs**: Brand information section.

## Page Flow

1. `HomePageComponent` loads on route `/`.
2. Catalog data is read from `data/` modules (products, offers, categories).
3. SEO metadata is set via `SeoService` using the `home` translation namespace.
4. JSON-LD structured data (`WebSite` + `SearchAction`) is rendered.
5. The UI renders HeroCarousel, offers, featured products, CategoryBannersSection, and AboutUs.

## HeroCarousel

Location: `src/app/features/home/components/hero-carousel/`

Features:

- Three configured banner images with mobile/desktop responsive variants.
- 5-second auto-rotation with pause on hover.
- Previous/next controls on large viewports.
- Dot indicator navigation.
- Touch swipe support (touchstart/touchend with threshold).
- CSS transition (`transition-transform duration-700 ease-in-out`).

## CategoryBannersSection

Location: `src/app/features/home/components/category-banners-section/`

Defines eight category entries with:

- Category ids and translation keys.
- Route targets.
- Image assets.
- Gradient and accent colors.
- Alternating left/right layout (`row` / `row-reverse`).

## AboutUs

Location: `src/app/features/home/components/about-us/`

Dark section (`bg-black text-white`) with rounded corners. Displays localized brand content and the project logo.

## Animations

- `scroll-scale.directive.ts`: Scroll-driven scale/opacity animation (replaces `useScrollScale` hook from Next.js).
- Category banners use CSS transitions for hover effects (translateY, box-shadow).
- All animations use CSS transitions and native Angular features (no external animation library).

## Data Sources

- Product catalog: `src/app/data/products.data.ts`.
- Offer data: `src/app/features/offers/data/offers.data.ts`.
- Categories: `src/app/data/categories.data.ts`.
- Translations: `src/assets/i18n/es.json` and `src/assets/i18n/en.json`.
- Assets: `src/assets/images/`.

## Related Files

- `src/app/features/home/pages/home-page/`
- `src/app/features/home/components/hero-carousel/`
- `src/app/features/home/components/category-banners-section/`
- `src/app/features/home/components/category-banner/`
- `src/app/features/home/components/about-us/`
- `src/app/features/home/directives/scroll-scale.directive.ts`
- `src/app/data/products.data.ts`
- `src/app/features/offers/data/offers.data.ts`
- `src/app/core/services/seo.service.ts`

## Current Limitations

- Featured product ids are hardcoded in the home page.
- Hero banners are hardcoded inside `HeroCarousel`.
- Home content is not fetched from a CMS or backend.
