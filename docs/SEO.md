# SEO Strategy

Centralized `SeoService` manages all SEO metadata dynamically (SPA) and server-rendered (SSR).

## Architecture

```
Component → applySeo(SeoConfig) → SeoService → DOM (client) / HTML (server)
```

### Supported Features

| Feature | Implementation |
|---|---|
| `<title>` | `Title.setTitle()` with brand suffix |
| `<meta name="description">` | `Meta.updateTag()` |
| Open Graph | `<meta property="og:*">` with dedup & cleanup |
| Twitter Cards | `<meta name="twitter:*">` with dedup & cleanup |
| Canonical URLs | Single `<link rel="canonical">` reused across navigations |
| JSON-LD | `<script type="application/ld+json">` with dedup by `@type` |
| Robots Meta | `<meta name="robots">` for cart, search, 404 |
| Sitemap | `public/sitemap.xml` (197 URLs) |

### JSON-LD Schemas

- `WebSite` — base (global)
- `Organization` — base (global)
- `Product` — product detail page
- `CollectionPage` — category, offers, search
- `ContactPage` — contact page
- `WebPage` — legal pages
- `BreadcrumbList` — breadcrumb navigation

## SPA vs SSR Flow

| Mode | How SEO is applied |
|---|---|
| SPA | `SeoService` updates DOM dynamically after navigation |
| SSR | `SeoService` runs on server; HTML includes full meta + JSON-LD |

## Configuration

- Route SEO data defined in `app.routes.ts` (via `data.seo`)
- Dynamic SEO (product, category) in component via `this.seo.applySeo()`
- `SITE_URL` constant in `core/constants.ts`
