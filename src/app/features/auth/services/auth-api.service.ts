import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getApiBaseUrl } from '@core/api/api.config';
import type { ApiEnvelope } from '@core/api/api-types';
import type { AuthResults, AuthUser, LoginRequest, RegisterRequest } from '../types/auth.interface';

/**
 * Cliente HTTP del contrato auth (B1). El `withCredentials: true` lo estampa el
 * interceptor `authInterceptor` para que la cookie httpOnly viaje en cada
 * request dirigido a `/api/`. El idioma (`?lang=`) solo aplica a GET públicos.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${getApiBaseUrl()}/auth`;

  login(data: LoginRequest): Observable<AuthResults> {
    return this.http
      .post<ApiEnvelope<AuthResults>>(`${this.baseUrl}/login`, data)
      .pipe(map((envelope) => envelope.data));
  }

  register(data: RegisterRequest): Observable<AuthUser> {
    return this.http
      .post<ApiEnvelope<AuthUser>>(`${this.baseUrl}/register`, data)
      .pipe(map((envelope) => envelope.data));
  }

  logout(): Observable<void> {
    return this.http
      .post<ApiEnvelope<null>>(`${this.baseUrl}/logout`, {})
      .pipe(map(() => undefined));
  }

  me(): Observable<AuthUser> {
    return this.http
      .get<ApiEnvelope<AuthUser>>(`${this.baseUrl}/me`)
      .pipe(map((envelope) => envelope.data));
  }
}