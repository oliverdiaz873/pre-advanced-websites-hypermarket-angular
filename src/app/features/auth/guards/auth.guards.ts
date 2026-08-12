import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { from, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PlatformService } from '@core/services/platform.service';

/**
 * Guard de rutas protegidas. Si la sesión aún no está restaurada espera a
 * `initialize()` (single-flight con el appInitializer). Si el usuario es
 * anónimo redirige a `/login?returnUrl=<ruta original>`.
 *
 * Durante SSR devuelve `true` (nunca redirige): la sesión solo puede resolverse
 * en el navegador (cookie httpOnly), así que se deja renderizar la página y el
 * guard se re-evalúa en el cliente tras la hidratación. Evita que el HTML
 * prerenderizado haga 302 a `/login` en cada recarga de una ruta protegida.
 */
export const requireAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platform = inject(PlatformService);

  if (!platform.isBrowser()) {
    return true;
  }

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
 *
 * Durante SSR devuelve `true` (la sesión aún no está resuelta) y se deja al
 * cliente decidir tras la hidratación.
 */
export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platform = inject(PlatformService);

  if (!platform.isBrowser()) {
    return true;
  }

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