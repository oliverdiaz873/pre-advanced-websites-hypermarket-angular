# Plan de Migración de Documentación: Next.js → Angular

## Objetivo
Migrar, adaptar y expandir la documentación del proyecto Hypermarket desde la versión Next.js a la versión Angular, asegurando que la documentación sea completa, precisa y específica para el ecosistema Angular.

---

## Estado Actual
### Documentación existente en el proyecto Angular
- [x] docs/MIGRATION_PLAN.md: Plan detallado de migración técnica de código
- [x] docs/migration-gaps.md: Auditoría de brechas de fidelidad en la migración
- [x] docs/ARCHITECTURE.md: Arquitectura del proyecto
- [x] docs/I18N_GUIDE.md: Guía de internacionalización
- [x] docs/getting-started.md: Guía de inicio rápido
- [x] docs/folder-structure.md: Estructura de carpetas
- [x] docs/features/cart.md: Documentación del carrito
- [x] docs/features/products.md: Documentación de productos
- [x] docs/features/search.md: Documentación de búsqueda
- [x] docs/features/home.md: Documentación de la página de inicio
- [x] README.md: Documentación básica del proyecto actualizada

---

## Fases del Plan de Migración de Docs

### Fase 1: Inventario de Documentación del Proyecto Next.js (Origen)
Objetivo: Identificar toda la documentación que existía en el proyecto pre-advanced-websites-hypermarket-next para evaluar qué hay que migrar.

Actividades:
- [ ] Recopilar y revisar toda la documentación del proyecto Next.js original (si está disponible):
  - README.md principal
  - Archivos de docs/ (si existían)
  - Documentación de features específicas (carrito, i18n, animaciones)
  - Guías de contribución (si existían)
  - CHANGELOG.md (si existía)
- [ ] Clasificar la documentación por tipo (general, técnica, características, guías)

### Fase 2: Actualizar la Documentación Básica del Proyecto Angular
Objetivo: Asegurar que la documentación básica del proyecto Angular esté actualizada y completa.

Actividades:
- [x] Actualizar README.md principal:
  - Descripción del proyecto (Hypermarket Angular)
  - Tecnologías utilizadas
  - Instrucciones de instalación y ejecución
  - Estructura del proyecto
- [ ] Verificar y actualizar LICENSE (si es necesario)
- [ ] (Opcional) Crear un CHANGELOG.md para seguir versiones y cambios

### Fase 3: Adaptar la Documentación Técnica a Angular
Objetivo: Tomar cualquier documentación técnica del proyecto Next.js y adaptarla a las particularidades de Angular.

Actividades:
- [x] Crear docs/ARCHITECTURE.md:
  - Arquitectura general (core, data, features)
  - Angular Patterns (Standalone Components, Signals)
  - Routing
  - State management con Angular Signals y localStorage
- [x] Crear docs/I18N_GUIDE.md:
  - Configuración de @ngx-translate
  - Translation Layers (UI + Product overlays)
  - Uso en templates y componentes
- [x] Actualizar docs/MIGRATION_PLAN.md:
  - Añadida sección Migration Status al principio
  - Paths corregidos (offers.data.ts, cart.service.ts, product-page.data.ts)
  - TOC reparado (secciones 5-7 eliminadas por no implementadas)
- [x] Actualizar docs/migration-gaps.md:
  - Convertido a Migration Gaps Audit
  - Listar issues resueltos
- [ ] Crear docs/STYLE_GUIDE.md (fuera de scope por ahora)

### Fase 4: Documentar las Características del Proyecto
Objetivo: Crear documentación específica para cada feature principal del proyecto.

Actividades completadas:
- [x] Crear docs/features/cart.md:
  - Diagrama de flujo Signals (WritableSignal → computed → effect → localStorage)
  - CartService con Signal state management
  - Componentes del carrito y persistencia
- [x] Crear docs/features/search.md:
  - SearchService reactivo con Signals
  - Normalización de texto (acentos, mayúsculas)
  - Componentes responsive (Desktop, Tablet, Mobile)
- [x] Crear docs/features/products.md:
  - ProductTranslatePipe + ProductTranslationService
  - Componentes reutilizables (ProductCard, ProductGrid, ProductCarousel, etc.)
  - SEO dinámico y JSON-LD
- [x] Crear docs/features/home.md (añadida fuera del plan original):
  - HeroCarousel con swipe táctil y auto-rotación
  - CategoryBannersSection con layout alternado
  - AboutUs y animaciones scroll

Omitidas por decisión de scope:
- [ ] docs/features/ANIMATIONS.md — Cubierto parcialmente en home.md y ARCHITECTURE.md
- [ ] docs/features/SEO.md — Cubierto en products.md y ARCHITECTURE.md (SeoService)

### Fase 5: Añadir Guías de Contribución y Mantenimiento
Objetivo: Proporcionar guías para quienes quieran contribuir o mantener el proyecto.

Actividades:
- [ ] Crear docs/CONTRIBUTING.md:
  - Cómo configurar el entorno de desarrollo
  - Flujo de trabajo (branches, commits, PRs)
  - Cómo ejecutar tests
  - Cómo reportar issues
- [ ] Crear docs/TROUBLESHOOTING.md:
  - Problemas comunes y soluciones
  - Errores frecuentes de compilación
  - Tips de depuración

### Fase 6: Verificación y Polish
Objetivo: Asegurar que toda la documentación sea precisa, completa y fácil de navegar.

Actividades:
- [ ] Revisar toda la documentación para verificar que los paths, nombres de archivos y explicaciones son correctos
- [ ] Añadir enlaces internos entre documentos para facilitar la navegación
- [ ] Verificar que la documentación está en el idioma correcto (español)
- [ ] (Opcional) Añadir un docs/SUMMARY.md o índice general

---

## Priorización de Tareas
1. Alta Prioridad (completada):
   - Actualizar README.md principal ✅
   - Crear ARCHITECTURE.md ✅
   - Crear I18N_GUIDE.md ✅
   - Actualizar MIGRATION_PLAN.md ✅
   - Actualizar migration-gaps.md ✅
   - Crear getting-started.md ✅
   - Crear folder-structure.md ✅
2. Alta Prioridad — Feature docs (completada):
   - docs/features/cart.md ✅
   - docs/features/products.md ✅
   - docs/features/search.md ✅
   - docs/features/home.md ✅
3. Fuera de scope (por decisión):
   - auth.md (autenticación no implementada en Angular)
   - contact.md (página simple, bajo valor documental)
   - legal.md (página simple, bajo valor documental)
   - navigation.md (cubierto en ARCHITECTURE.md)
   - offers.md (comparte conceptos con products)
   - layout.md (cubierto en ARCHITECTURE.md)
   - STYLE_GUIDE.md, CONTRIBUTING.md, TROUBLESHOOTING.md (guías de equipo)
   - SKELETON_LOADINGS.md, SKELETON_VISUAL_MATCHING.md (docs de proceso de migración)
