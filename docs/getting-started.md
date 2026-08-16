# Getting Started

This project is an Angular standalone application for a localized hypermarket storefront. The codebase uses TypeScript, Angular Standalone Components, Angular Signals, `@ngx-translate`, Tailwind CSS through PostCSS, and local catalog data stored in TypeScript modules.

## Prerequisites

- Node.js compatible with Angular `21.2.0`
- npm, using the committed `package-lock.json`
- Angular CLI (optional, `npm start` uses Angular CLI behind the scenes)

## Installation

Install dependencies from the project root:

```bash
npm install
```

## Environment Variables

No environment variables are required at runtime or build time by the application.

The codebase does not read from `process.env` (nor from `.env` files): API
configuration lives in `src/app/core/api/api.config.ts`. The tracked
`.env.example` only documents the deployment variables (`ANGULAR_API_BASE_URL`,
`ANGULAR_STORAGE_PUBLIC_URL`) that must be applied there before a production
build — the app does not load them automatically.

## Available Commands

```bash
npm start
```

Starts the Angular development server (wraps `ng serve`).

```bash
npm run build
```

Creates a production build.

```bash
ng serve
```

Alternative: runs the Angular development server directly.

```bash
npm test
```

Runs tests using Vitest.

## Main Dependencies

- `@angular/core` and `@angular/router`: Angular framework and routing, currently at `21.2.0`
- `@ngx-translate/core` and `@ngx-translate/http-loader`: internationalization
- `tailwindcss`: styling pipeline via PostCSS, currently at `4.3.1`
- `typescript`: static typing
- `vitest`: unit testing
- `rxjs`: reactive extensions

## Development Notes

- Application source lives under `src/app/`.
- Static assets live under `src/assets/`.
- Translations live under `src/assets/i18n/es.json` and `src/assets/i18n/en.json`.
- Catalog data is local and imported from `src/app/data/`.
- The Angular Router is configured in `src/app/app.routes.ts` using standalone component lazy loading.
- State management uses Angular Signals (cart, UI state) and RxJS (services, HTTP).
- There is no backend API, authentication, database, or checkout integration implemented.
