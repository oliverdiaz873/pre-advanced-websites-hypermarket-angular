import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traduce el envelope de error del backend a una clave i18n para la edición de
 * perfil (PATCH /auth/me). Reutiliza los mensajes compartidos de `auth.errors`
 * (session_expired / rate_limited / unknown) y aporta un mensaje específico
 * (`update_failed`) para los fallos de validación del propio update (name vacío
 * o phone no string), que en login/register no tienen sentido.
 */
export function accountErrorKey(error: HttpErrorResponse): string {
  const body = error.error as { code?: string } | null;
  switch (body?.code) {
    case 'UNAUTHORIZED':
      return 'auth.errors.session_expired';
    case 'RATE_LIMITED':
      return 'auth.errors.rate_limited';
    case 'VALIDATION_ERROR':
    case 'NOT_FOUND':
      return 'auth.errors.update_failed';
    case 'INTERNAL_ERROR':
    default:
      return 'auth.errors.unknown';
  }
}
