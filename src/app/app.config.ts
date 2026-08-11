import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { provideI18n } from '@core/i18n/i18n.config';
import { apiLangInterceptor } from '@core/api/api-lang.interceptor';
import { provideApiLangSync } from '@core/api/api-lang-sync';
import { authInterceptor } from '@features/auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptors([apiLangInterceptor, authInterceptor])),
    provideClientHydration(),
    provideApiLangSync(),
    ...provideI18n()
  ]
};