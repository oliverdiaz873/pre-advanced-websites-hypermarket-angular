import { Injectable, Provider, inject, APP_INITIALIZER } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiLangService } from '@core/api/api-lang.service';

/**
 * Puente entre ngx-translate (fuente de idioma del storefront) y ApiLangService.
 * Se instancia en el arranque vía provideApiLangSync() para que el interceptor
 * de lang (api-lang.interceptor) estampe `?lang=` con el idioma activo real.
 */
@Injectable({ providedIn: 'root' })
export class ApiLangSyncService {
  private readonly translate = inject(TranslateService);
  private readonly apiLang = inject(ApiLangService);

  constructor() {
    const initialLang = this.translate.currentLang() || 'es';
    this.sync(initialLang);
    this.translate.onLangChange.subscribe((event) => {
      this.sync(event.lang);
    });
  }

  private sync(lang: string): void {
    this.apiLang.setLang(lang === 'en' ? 'en' : 'es');
  }
}

/** Fuerza la creación del sync al arrancar la aplicación. */
export function provideApiLangSync(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: (sync: ApiLangSyncService) => () => {
      void sync;
    },
    deps: [ApiLangSyncService],
  };
}
