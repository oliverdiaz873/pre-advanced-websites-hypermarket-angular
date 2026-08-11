import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor de sesión (A1):
 * - Estampa `withCredentials: true` en todo request dirigido al backend (`/api/`)
 *   para que la cookie httpOnly viaje en cada llamada same-origin.
 * - 401 en mitad de sesión (token expirado/revocado): limpia el estado y emite
 *   un aviso `session_expired` que la capa UI traduce y muestra como toast.
 *   No redirige por sí mismo; el guard reenvía a `/login` si se navega a una
 *   ruta protegida.
 * - 429 (RATE_LIMITED): aviso `rate_limited`.
 * Las rutas públicas de auth (`/auth/login`, `/auth/register`, `/auth/me`)
 * quedan excluidas del manejo de 401 para que el formulario muestre el error
 * inline y `initialize()` decida el estado por su cuenta.
 * Nota: no inyecta TranslateService/ToastService para evitar un ciclo de DI en
 * SSR (las traducciones se cargan vía HttpClient pasando por este interceptor).
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next) => {
  const auth = inject(AuthService);

  const isApi = req.url.includes('/api/');
  const outgoing = isApi ? req.clone({ withCredentials: true }) : req;

  return next(outgoing).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isApi && shouldHandle(error.url)) {
        if (error.status === 401 && auth.authenticated()) {
          auth.expireSession();
          auth.notify('session_expired');
        } else if (error.status === 429) {
          auth.notify('rate_limited');
        }
      }
      return throwError(() => error);
    }),
  );
};

/** 401 con credenciales inválidas / restauración de sesión se muestran inline. */
function shouldHandle(url: string | null): boolean {
  if (!url) return false;
  const publicAuthPaths = ['/auth/login', '/auth/register', '/auth/me'];
  return !publicAuthPaths.some((path) => url.includes(path));
}