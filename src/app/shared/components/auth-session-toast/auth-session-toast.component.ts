import { Component, effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthNotice, AuthService } from '@features/auth/services/auth.service';
import { ToastService } from '../toast/toast.service';

const noticeKeys: Record<AuthNotice, string> = {
  session_expired: 'auth.errors.session_expired',
  rate_limited: 'auth.errors.rate_limited',
};

/**
 * Consume los avisos de sesión emitidos por el interceptor (A1). Vive fuera de
 * la cadena HTTP para poder inyectar TranslateService sin provocar el ciclo de
 * DI de SSR (las traducciones se cargan vía HttpClient que pasa por interceptors).
 */
@Component({
  selector: 'app-auth-session-toast',
  standalone: true,
  template: '',
})
export class AuthSessionToastComponent {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      const notice = this.auth.notice();
      if (!notice) return;
      this.toast.warning(this.translate.instant(noticeKeys[notice]));
      this.auth.clearNotice();
    });
  }
}