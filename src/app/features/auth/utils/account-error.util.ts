import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traduce el envelope de error del backend a una clave i18n para la edición de
 * perfil (PATCH /auth/me). Reutiliza los mensajes compartidos de `auth.errors`
 * (session_expired / rate_limited / unknown) y aporta un mensaje específico
 * y mensajes específicos cuando el backend aporta suficiente información.
 */
export function accountErrorKey(error: HttpErrorResponse): string {
  const body = error.error as { code?: string; message?: string } | null;
  switch (body?.code) {
    case 'UNAUTHORIZED':
      return 'auth.errors.session_expired';
    case 'RATE_LIMITED':
      return 'auth.errors.rate_limited';
    case 'VALIDATION_ERROR':
      if (body.message === 'Name must be a non-empty string') {
        return 'auth.errors.name_invalid';
      }
      if (body.message === 'Phone must be a string') {
        return 'auth.errors.phone_invalid';
      }
      return 'auth.errors.update_failed';
    case 'NOT_FOUND':
      return 'auth.errors.update_failed';
    case 'INTERNAL_ERROR':
    default:
      return 'auth.errors.unknown';
  }
}
