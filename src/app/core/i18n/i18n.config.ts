import { Provider } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const SUPPORTED_LANGS = ['es', 'en'] as const;
const DEFAULT_LANG = 'es';

function getInitialLang(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('language');
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }
  }
  return DEFAULT_LANG;
}

export function provideI18n(): Provider[] {
  return [
    provideTranslateService({ lang: getInitialLang() }),
    provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' })
  ];
}

