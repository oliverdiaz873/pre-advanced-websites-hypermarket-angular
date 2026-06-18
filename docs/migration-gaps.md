# Migration Fidelity Gaps

## Pendientes para alcanzar 100% de fidelidad con Next.js

### Fase 6 — Carrito
- [ ] `CartService` (BehaviorSubject + localStorage con rehidratación en bootstrap)
- [ ] `AddToCartButton` con contador `- N +`
- [ ] `QuantityControls` component
- [ ] Badge de cantidad en Header

### Fase 7 — Productos y Búsqueda
- [ ] `ProductTranslatePipe` con fallback exacto: `tProducts('products.{id}.name') ?? product.nombre`
- [ ] `OfferBadge` component con icono fire SVG
- [ ] Traducción de unit label via pipe `translate('units.' + rawUnit)` con fallback
- [ ] `ProductCard` con `ChangeDetectionStrategy.OnPush`

### Fase 8 — Páginas y Layout
- [ ] Navegación SPA (`[routerLink]` en vez de `<a href>`)
- [ ] Rutas con prefijo de idioma (`es/producto/...`, `en/product/...`)
      ⚠️ No implementar hasta que i18n routing esté listo
- [ ] Aria-labels traducidos dinámicamente

### Fase 9 — Refinamiento
- [ ] Refactor: eliminar métodos duplicados en `ProductCard` (`cleanPrice`, `getAssetUrl`, `getUnitLabel`, `getFormattedPrice`) y usar `core/utils/`
- [ ] Migrar `<img>` a `NgOptimizedImage` como reemplazo funcional de `next/image`
