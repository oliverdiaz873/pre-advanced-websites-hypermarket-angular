import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traduce el envelope de error del backend a una clave i18n. El `code` del
 * backend (B1): `VALIDATION_ERROR | UNAUTHORIZED | CONFLICT | RATE_LIMITED |
 * NOT_FOUND | INTERNAL_ERROR`.
 */
export function authErrorKey(error: HttpErrorResponse): string {
  const body = error.error as { code?: string } | null;
  switch (body?.code) {
    case 'UNAUTHORIZED':
      return 'auth.errors.invalid_credentials';
    case 'CONFLICT':
      return 'auth.errors.email_exists';
    case 'RATE_LIMITED':
      return 'auth.errors.rate_limited';
    case 'VALIDATION_ERROR':
    case 'NOT_FOUND':
      return 'auth.errors.invalid_credentials';
    case 'INTERNAL_ERROR':
    default:
      return 'auth.errors.unknown';
  }
}