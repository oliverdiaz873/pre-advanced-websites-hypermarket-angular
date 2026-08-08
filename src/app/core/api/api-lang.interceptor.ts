import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLangService } from './api-lang.service';

/**
 * Interceptor funcional que estampa `?lang=<idioma activo>` en todo GET dirigido
 * al backend (`/api/`). Así los mappers de productos/ofertas localizan
 * name/description sin que cada servicio repita la lógica. Los requests a
 * `/assets/` (i18n json) no se tocan.
 */
export const apiLangInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const apiLang = inject(ApiLangService);

  const isApiGet = req.method === 'GET' && req.url.includes('/api/');
  if (!isApiGet) {
    return next(req);
  }

  let params = req.params;
  if (!params.has('lang')) {
    params = params.set('lang', apiLang.lang());
  }

  return next(req.clone({ params }));
}