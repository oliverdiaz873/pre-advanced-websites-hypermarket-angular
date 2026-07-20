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
- [ ] Actualizar docs/MIGRATION_PLAN.md:
  - Añadir sección Migration Status al principio
  - Mantener el historial de fases original
- [x] Actualizar docs/migration-gaps.md:
  - Convertir a Migration Gaps Audit
  - Listar issues resueltos
- [ ] Crear docs/STYLE_GUIDE.md:
  - Guías de estilo de código (TypeScript, SCSS, templates Angular)
  - Convenciones de nomenclatura (componentes, servicios, pipes, directivas)
  - Buenas prácticas específicas de Angular

### Fase 4: Documentar las Características del Proyecto
Objetivo: Crear documentación específica para cada feature principal del proyecto.

Actividades:
- [ ] Crear docs/features/CART.md:
  - Funcionamiento del servicio CartService
  - Persistencia en localStorage
  - Componentes del carrito
  - Uso del badge en el Header
- [ ] Crear docs/features/SEARCH.md:
  - Funcionamiento del sistema de búsqueda
  - Cómo funciona la normalización de texto (search-utils.ts)
  - Componentes de búsqueda responsive (Desktop, Tablet, Mobile)
- [ ] Crear docs/features/PRODUCTS.md:
  - Estructura de datos de productos y categorías
  - Componentes de productos (ProductCard, ProductCarousel, ProductDetailSection, etc.)
  - Traducciones superpuestas de productos
- [ ] Crear docs/features/ANIMATIONS.md:
  - Animaciones de Angular (@angular/animations)
  - Directivas de animación
  - Efectos visuales (hover, scroll reveal, etc.)
- [ ] Crear docs/features/SEO.md:
  - Funcionamiento del SeoService
  - Cómo establecer título y metaetiquetas dinámicas
  - JSON-LD para datos estructurados

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
1. Alta Prioridad:
   - Actualizar README.md principal ✅
   - Crear ARCHITECTURE.md ✅
   - Crear I18N_GUIDE.md ✅
   - Actualizar MIGRATION_PLAN.md (add Migration Status)
   - Actualizar migration-gaps.md (convert to audit) ✅
2. Media Prioridad:
   - Documentar features principales (CART.md, SEARCH.md, PRODUCTS.md)
3. Baja Prioridad:
   - Guías de contribución (CONTRIBUTING.md)
   - Troubleshooting
   - Guías de animaciones y SEO
