import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E — Consumidor Angular (E3-A).
 *
 * Valida el flujo real del consumidor contra el backend E3 (localhost:3000):
 *   login → catálogo → carrito → checkout (dirección + idempotencia)
 *   → confirmar pedido (pending) → pay (paid) → cancelar (cancelled/refunded)
 *   → historial → detalle. Incluye la verificación E3-Integration (admin API)
 *   y E3-Admin en specs separados.
 *
 * Requiere el backend corriendo en :3000 (ver `reuseExistingServer`).
 * El `webServer` lanza `ng serve` en :4200 (proxy /api → :3000) y lo reutiliza
 * si ya está vivo.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  timeout: 90_000,
  use: {
    baseURL: process.env.NG_E2E_BASE_URL ?? 'http://localhost:4200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
