# Hydration

Enabled via `provideClientHydration()` in `app.config.ts`.

## How It Works

1. Server renders full HTML (including SEO meta, JSON-LD, header)
2. Client downloads JS bundles
3. Angular attaches event listeners to existing DOM (no full re-render)

## Known Concerns

| Concern | Status |
|---|---|
| Cart signal rehydration | `StorageService.get()` runs after hydration; DOM shows SSR content initially |
| Skeleton loading | Data is synchronous now (no setTimeout); no flickering |
| Language persistence | `StorageService.get('language')` only runs on client; server defaults to `'es'` |
| ScrollAnimateDirective | SSR-safe (`isPlatformBrowser` guard) |
| ScrollToTop | SSR-safe (`isPlatformBrowser` guard) |
| Legal layout date display | Uses `isPlatformBrowser` for current year |

## Debugging

If hydration errors occur:

1. Check `ngDevMode` hydration warnings in console
2. Avoid direct DOM manipulation outside Angular
3. Use `ngSkipHydration` as last resort on specific components
