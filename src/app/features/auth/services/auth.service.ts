import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { PlatformService } from '@core/services/platform.service';
import { AuthApiService } from './auth-api.service';
import type { AuthStatus, AuthUser, LoginRequest, RegisterRequest } from '../types/auth.interface';

export type AuthNotice = 'session_expired' | 'rate_limited';

/**
 * Estado de sesión en signals (A1). El backend gestiona la cookie httpOnly;
 * este servicio solo conoce la identidad vía `GET /auth/me`. El status inicial
 * es `loading` tanto en server como en cliente para que SSR y la primera
 * hidratación rendericen el mismo HTML; `initialize()` resuelve la sesión solo
 * en el navegador.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApiService);
  private readonly platform = inject(PlatformService);

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _status = signal<AuthStatus>('loading');
  private readonly _notice = signal<AuthNotice | null>(null);

  readonly user = this._user.asReadonly();
  readonly status = this._status.asReadonly();
  readonly notice = this._notice.asReadonly();
  readonly authenticated = computed(() => this._user() !== null);
  readonly initials = computed(() => {
    const name = this._user()?.name.trim() ?? '';
    if (!name) return '';
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  });

  private restorePromise: Promise<void> | null = null;

  /** Restaura la sesión (GET /me) una sola vez y solo en el navegador. */
  initialize(): Promise<void> {
    if (!this.platform.isBrowser()) {
      return Promise.resolve();
    }
    if (this._user() !== null || this._status() === 'anonymous') {
      return Promise.resolve();
    }
    if (this.restorePromise) {
      return this.restorePromise;
    }

    this.restorePromise = new Promise<void>((resolve) => {
      this.api.me().subscribe({
        next: (user) => {
          this._user.set(user);
          this._status.set('authenticated');
          resolve();
        },
        error: () => {
          this._user.set(null);
          this._status.set('anonymous');
          resolve();
        },
      });
    });

    return this.restorePromise;
  }

  login(data: LoginRequest): Observable<AuthUser> {
    return this.api.login(data).pipe(
      tap((result) => {
        this._user.set(result.user);
        this._status.set('authenticated');
      }),
      map((result) => result.user),
    );
  }

  /** Registro + login automático (el backend no emite cookie en /register). */
  register(data: RegisterRequest): Observable<AuthUser> {
    return this.api.register(data).pipe(
      switchMap(() => this.login({ email: data.email, password: data.password })),
    );
  }

  logout(): Observable<void> {
    return this.api.logout().pipe(
      tap(() => {
        this._user.set(null);
        this._status.set('anonymous');
      }),
    );
  }

  /** Sesión perdida a mitad de uso (401 global del interceptor). */
  expireSession(): void {
    this._user.set(null);
    this._status.set('anonymous');
  }

  /** Aviso para la capa de UI (sin dependencias de traducción). */
  notify(code: AuthNotice): void {
    this._notice.set(code);
  }

  clearNotice(): void {
    this._notice.set(null);
  }
}