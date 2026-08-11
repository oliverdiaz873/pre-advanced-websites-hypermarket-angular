import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { from, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard de rutas protegidas. Si la sesión aún no está restaurada espera a
 * `initialize()` (single-flight con el appInitializer). Si el usuario es
 * anónimo redirige a `/login?returnUrl=<ruta original>`.
 */
export const requireAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.status() === 'authenticated') {
    return true;
  }

  const redirect = (): UrlTree =>
    router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  if (auth.status() === 'anonymous') {
    return redirect();
  }

  return from(auth.initialize()).pipe(
    map(() => (auth.status() === 'authenticated' ? true : redirect())),
  );
};

/**
 * Guard para páginas de autenticación (login/register): un usuario ya autenticado
 * es reenviado a `/account`.
 */
export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.status() === 'authenticated') {
    return router.createUrlTree(['/account']);
  }

  if (auth.status() === 'anonymous') {
    return true;
  }

  return from(auth.initialize()).pipe(
    map(() => (auth.status() === 'authenticated' ? router.createUrlTree(['/account']) : true)),
  );
};