# Search

## Status

Implemented.

## Overview

The search feature supports header search (desktop, tablet, mobile variants) and a full search results page. Search is client-side and uses the local product catalog with reactive filtering.

## Search Flow

```
User input
    |
    v
SearchService
    |
    +--> Signal(query)
    |
    +--> Computed results (filtered products)
    |
    v
Search page / Header
    |
    +--> ProductGrid or EmptySearchResults
```

## SearchService

Location: `src/app/features/search/services/search.service.ts`

Centralizes search state and logic using Angular Signals:

- `query: WritableSignal<string>`: Current search term.
- `results: Signal<ProductUI[]>`: Computed filtered product list.
- `normalize(text)`: Text normalization utility.
- `search(query)`: Sets the query signal; filtering is reactive.

## Text Normalization

Location: `src/app/core/utils/search-utils.ts`

- `normalizarTexto(text)`: Lowercases text, decomposes diacritics, removes accent marks.
- `hasSearchQuery(text)`: Checks for non-empty search input.
- `matchesSearchQuery(text, query)`: Shared matching helper.

Search matches against product names and translated names (via `ProductTranslatePipe`).

## Components

- `HeaderSearchComponent`: Search input in header with autocomplete-style dropdown.
- `DesktopSearchComponent`: Full search input for large viewports.
- `TabletSearchComponent`: Toggleable search for tablet viewports.
- `MobileSearchComponent`: Slide-in search for mobile viewports.
- `SearchPageComponent`: Full search results page reading `q` query param.
- `EmptySearchResultsComponent`: Empty state when no products match.

## Search Results Page

Route: `search` in `app.routes.ts`.

Flow:

1. Reads `q` query parameter from `ActivatedRoute.queryParamMap`.
2. Passes to `SearchService.search()`.
3. Normalizes the query with `normalizarTexto`.
4. Filters local products by name and translated name.
5. Renders matches through `ProductGridComponent`.
6. Renders `EmptySearchResultsComponent` when no matches found.
7. SEO metadata set via `SeoService` from the `search` translation namespace.

## Header Search Behavior

1. User opens search (keyboard shortcut or click).
2. User types a term.
3. Products are filtered by source name and translated name.
4. Results normalized with `normalizarTexto`.
5. Results limited to eight products.
6. Selecting a result routes to `/product/:id`.
7. Submitting a query routes to `/search?q=...`.

## Related Files

- `src/app/features/search/services/search.service.ts`
- `src/app/features/search/components/search-page/`
- `src/app/features/search/components/header-search/`
- `src/app/features/search/components/desktop-search/`
- `src/app/features/search/components/tablet-search/`
- `src/app/features/search/components/mobile-search/`
- `src/app/features/search/components/empty-search-results/`
- `src/app/core/utils/search-utils.ts`
- `src/app/data/products.data.ts`

## Current Limitations

- Search is client-side only.
- Search only matches product names and translated product names.
- There is no ranking, typo tolerance, category search, or server-side search index.
