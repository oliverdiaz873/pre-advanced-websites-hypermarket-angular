/**
 * Configuración de acceso al backend (F5.1).
 *
 * Semántica compartida (véase docs/F5-CONTRACT-AUDIT.md):
 * - `apiBaseUrl`: origen del API REST (dev: backend local; prod: dominio del API).
 * - `storagePublicUrl`: base para resolver claves de imagen relativa de la seed
 *   (dev: `/uploads` servido por el backend; prod: base pública del CDN/R2).
 */
const DEFAULT_API_BASE_URL = '/api';
const DEFAULT_STORAGE_PUBLIC_URL = 'http://localhost:3000';

export const API_CONFIG = {
  apiBaseUrl: DEFAULT_API_BASE_URL,
  storagePublicUrl: DEFAULT_STORAGE_PUBLIC_URL,
};

/** Stub para futuros environments de Angular (appConfig puede sobreescribirlo). */
export type ApiEnvironmentConfig = typeof API_CONFIG;

export const getApiBaseUrl = (): string => API_CONFIG.apiBaseUrl;
export const getStoragePublicUrl = (): string => API_CONFIG.storagePublicUrl;