# Server-Side Rendering (SSR)

Angular SPA was migrated to SSR using `@angular/ssr` (v21).

## Architecture

```
Request → AngularNodeAppEngine → Render → Full HTML → Client Hydration
```

### Key Files

| File | Purpose |
|---|---|
| `server.ts` | Node.js HTTP server using `AngularNodeAppEngine` |
| `src/main.server.ts` | Server bootstrap entry point |
| `src/app/app.config.server.ts` | Server providers (`provideServerRendering`) |

## Browser vs Server Separation

| API | Approach |
|---|---|
| `localStorage` | `StorageService` — returns `null` on server |
| `window` / `document` | `PlatformService.isBrowser()` guard |
| Renderer2 | Already SSR-safe |

## Services

- `PlatformService` — `isBrowser()` check (wraps `isPlatformBrowser`)
- `StorageService` — safe get/set/remove for SSR

## Build

```bash
npm run build
# Output: dist/ (browser/ + server/ bundles)
```
