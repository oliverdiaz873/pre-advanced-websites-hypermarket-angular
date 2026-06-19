# Migration Fidelity Gaps

## Estado revisado al cierre de Fase 7.5 / inicio de Fase 8

### Fase 6 - Carrito
- [x] `CartService` con estado reactivo, persistencia local y rehidratacion.
- [x] `AddToCartButton` con flujo agregar / cantidad.
- [x] `QuantityControls` component.
- [x] Badge de cantidad en Header.

### Fase 7 - Productos y Busqueda
- [x] `ProductTranslatePipe` con fallback a `product.nombre`.
- [x] `OfferBadge` component conectado a `ProductCard` y ofertas.
- [x] Unit label centralizado via `core/utils` y traducciones existentes.
- [x] `ProductCard` con `ChangeDetectionStrategy.OnPush`.

### Fase 7.5 - Estabilizacion UI
- [x] Assets disponibles en `public/assets` y espejo en `src/assets`.
- [x] UI compartida: breadcrumb, empty-state, scroll-to-top.
- [x] Skeletons reutilizables: ProductsGridSkeleton y HeroSkeleton.
- [x] Navegacion responsive definida: mobile <768, tablet 768-1023, desktop >=1024.

### Fase 8 - Paginas y Layout
- [x] Home real reemplaza CatalogPage en ruta raiz.
- [x] `category/:id` con secciones/carruseles y filtro por subcategoria.
- [x] `product/:id` con detalle, relacionados y fallback 404 visual.
- [x] `offers` con filtro y estado vacio.
- [x] `contact` con Reactive Forms y validaciones.
- [x] `legal/terms` y `legal/privacy` con LegalLayout.
- [x] `app.routes.ts` con `ShopLayoutComponent`, lazy routes y NotFound.
- [ ] Rutas con prefijo de idioma (`es/producto/...`, `en/product/...`) - diferido hasta Fase 9 i18n-ready.
- [ ] Aria-labels traducidos dinamicamente en toda la superficie.

### Fase 9 - Refinamiento
- [ ] SEO service (title, meta, JSON-LD por pagina).
- [ ] Error handler global (ErrorHandler).
- [ ] sitemap.xml y robots.txt estaticos.
- [ ] Optimizacion final: NgOptimizedImage, lazy loading y build prod estricto.
- [ ] Preparar estructura para routing i18n ES/EN sin activarlo aun.

### Fase 9B - Visual Parity
- [ ] **HeroCarousel**: carrusel con auto-rotacion (5s), touch swipe, indicadores, 3 banners responsive.
- [ ] **CategoryBannersSection**: 8 banners de categoria con gradientes, floating images, hover effects.
- [ ] **AboutUs**: seccion con scroll reveal y parallax.
- [ ] **OfferBadge**: FireIcon SVG + gradiente Next.js (`#ff6b35` → `hsl(33,100%,50%)`).
- [ ] **Offers filters**: sidebar OfferFilters en desktop, Drawer en mobile.
- [ ] **appScrollAnimate directive**: IntersectionObserver para animaciones scroll.
- [ ] **Search responsive**: consolidar en 1 componente responsive (reemplazar 3 variantes).
- [ ] **ProductCarousel controles**: botones oscuros `rgba(0,0,0,0.7)` estilo Next.js.
- [ ] **Ajustes CSS**: max-width 1400px consistente, padding, bordes, espaciado.
- [ ] **Skeletons restantes**: BaseSkeleton, CategoriesSkeleton, OfferCardSkeleton, ProductCardSkeleton.
