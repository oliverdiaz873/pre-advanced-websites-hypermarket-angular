# Guía de Internacionalización (i18n)

Este proyecto usa `@ngx-translate/core` y `@ngx-translate/http-loader` para la internacionalización, soportando los idiomas español (es) e inglés (en).

---

## Translation Layers
El proyecto tiene dos sistemas de traducción:

### 1. Static UI Translations
Usados para todos los elementos de interfaz de usuario (botones, etiquetas, encabezados, etc.).

Archivos:
```
assets/i18n/
├── es.json
└── en.json
```

Organizados por namespaces:
```json
{
  "common": { ... },
  "header": { ... },
  "footer": { ... },
  "home": { ... },
  "categories": { ... },
  "offers": { ... },
  "search": { ... },
  "cart": { ... },
  "contact": { ... },
  "legal": { ... }
}
```

### 2. Dynamic Product Translations
Los productos usan campos bilingües directamente en la estructura de datos, con fallback al nombre original.

Ejemplo:
```typescript
// La interfaz Product usa el nombre original como base, con traducciones superpuestas
{
  id: "product-id",
  nombre: "Nombre Original", // Fallback si no hay traducción
  // ... otros campos
}
```

El pipe `ProductTranslatePipe` maneja las traducciones superpuestas desde `assets/i18n/*.json` bajo el namespace `products`:
```json
// assets/i18n/es.json
{
  "products": {
    "product-id": "Nombre Traducido"
  }
}
```

---

## Configuración
La configuración de i18n está en `src/app/core/i18n/i18n.config.ts`.

### Parámetros Clave
- Idiomas soportados: `['es', 'en']`
- Idioma por defecto: `es`
- Persistencia: El idioma seleccionado se guarda en `localStorage` con la clave `'language'`
- Carga de traducciones: Los archivos JSON se cargan desde `/assets/i18n/`

### Inicialización
El servicio se inicializa en `app.config.ts` usando la función `provideI18n()`.

---

## Uso en el código

### En templates con el pipe `translate`
```html
<h1>{{ 'home.title' | translate }}</h1>
<button>{{ 'common.addToCart' | translate }}</button>
```

### En componentes con `TranslateService`
```typescript
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({ ... })
export class MyComponent {
  private translate = inject(TranslateService);

  greet() {
    const greeting = this.translate.instant('common.greeting');
    console.log(greeting);
  }
}
```

### Traducciones superpuestas de productos
Para productos con una traducción opcional y fallback al nombre original, usa el pipe `ProductTranslatePipe`:
```html
<!-- Si existe la traducción 'products.product-id' se usa, si no, usa product.nombre -->
<h2>{{ product.id | productTranslate:product.nombre }}</h2>
```

---

## Cambio de idioma
El componente `LanguageSelector` permite cambiar el idioma. Al cambiarlo:
1. Se actualiza el idioma en `TranslateService`
2. Se guarda la selección en `localStorage`
3. Todas las traducciones se actualizan automáticamente

---

## Añadir nuevas traducciones
1. Añade la nueva clave y su valor en ambos archivos `es.json` y `en.json`
2. Usa la clave en tus templates o componentes

Ejemplo:
```json
// src/assets/i18n/es.json
{
  "common": {
    "newKey": "Nuevo Texto"
  }
}
```
```json
// src/assets/i18n/en.json
{
  "common": {
    "newKey": "New Text"
  }
}
```
```html
<p>{{ 'common.newKey' | translate }}</p>
```
