import { Injectable, signal } from '@angular/core';
import type { ApiLang } from './api-types';

/**
 * Fuente única del idioma para llamadas al backend (F5.1). F5.2 lo sincroniza
 * con ngx-translate (`onLangChange`). El interceptor de lang lo lee y estampa
 * `?lang=` en cada GET de `/api/`.
 */
@Injectable({ providedIn: 'root' })
export class ApiLangService {
  private readonly _lang = signal<ApiLang>('es');

  readonly lang = this._lang.asReadonly();

  setLang(lang: ApiLang): void {
    this._lang.set(lang);
  }
}