# Integración con la API — Angular Store

- **Estado**: Borrador (F0.0)
- **Fase de ejecución**: F4-A
- **Contrato oficial**: `backend-advanced-websites-hypermarket-express-mongodb/docs/API-CONTRACT.md` (el backend define la API; este documento solo describe cómo la consume este storefront).

## 1. Consumo de productos

`GET {apiBaseUrl}/products?lang=es|en`

- Parámetros: `page`, `limit`, `q`, `category`, `status`, `lang`, `sortBy`, `sortOrder`.
- El contenido (`name`, `description`) llega **localizado** según `lang`.
- `image` es una **URL pública** (R2/CDN); este storefront no construye keys de storage.

## 2. Mapping API → modelo local

```ts
// src/app/core/types/product.interface.ts (modelo local actual)
interface ProductLocal {
  id: string; name: string; url: string;
  categoria: string; precio: number; precioTexto: string;
  imagen: string; unidad?: string; quantity?: number;
}
```

El `ProductMapper` (F4-A) deriva client-side los campos de presentación:

| Campo local | Origen en la API |
| --- | --- |
| `id` | `id` |
| `name` | `name` (resuelto por `?lang=`) |
| `url` | `/product/{id}` (se genera, no viene del backend) |
| `categoria` | `category.slug` |
| `precio` | `price` |
| `precioTexto` | formateado desde `price` + `unit`/`unitQuantity` |
| `imagen` | `image` |
| `unidad` / `quantity` | `unit` / `unitQuantity` |

## 3. Otras fuentes

- **Categorías**: `GET /categories`.
- **Ofertas**: `GET /offers`.
- **Búsqueda**: `GET /search?q=&lang=` (server-side).

## 4. Modo mock (transición)

Durante la transición el storefront puede operar con `useMockData=true`
(datos estáticos actuales) y alternar a `false` para consumir la API real. Las
claves i18n `products.{id}.*` quedan como fallback en modo mock.

## 5. Imágenes

- Angular: `getAssetUrl()` (`src/app/core/utils/asset-utils.ts`) ya acepta URLs
  absolutas (`http`) → sirve para R2 sin cambios.
- No se añade `remotePatterns` (es un ajuste de Next.js, no de Angular).

## 6. Pendiente en F4-A

- `environments/` con `apiBaseUrl`.
- `ApiProductSource` / `MockProductSource` + `ProductMapper`.
- `ProductService` sobre HTTP real; búsqueda y ofertas desde la API.
- Manejo SSR/hydration y cache.
- Tests (source, mapper, list, detail).
