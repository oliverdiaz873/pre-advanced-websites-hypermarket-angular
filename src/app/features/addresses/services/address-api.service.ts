import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getApiBaseUrl } from '@core/api/api.config';
import type { ApiEnvelope } from '@core/api/api-types';
import type { Address, AddressInput } from '../types/address.interface';

/**
 * Cliente HTTP del contrato addresses (E3). El `withCredentials: true` lo
 * estampa el interceptor `authInterceptor` para que la cookie httpOnly viaje
 * en cada request dirigido a `/api/`.
 */
@Injectable({ providedIn: 'root' })
export class AddressApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${getApiBaseUrl()}/addresses`;

  /** GET /api/addresses — lista de direcciones del usuario autenticado. */
  list(): Observable<Address[]> {
    return this.http
      .get<ApiEnvelope<Address[]>>(this.baseUrl)
      .pipe(map((envelope) => envelope.data));
  }

  /** GET /api/addresses/:id — dirección concreta (owner-only). */
  getById(id: string): Observable<Address> {
    return this.http
      .get<ApiEnvelope<Address>>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(map((envelope) => envelope.data));
  }

  /** POST /api/addresses — crea una dirección. */
  create(input: AddressInput): Observable<Address> {
    return this.http
      .post<ApiEnvelope<Address>>(this.baseUrl, input)
      .pipe(map((envelope) => envelope.data));
  }

  /** PATCH /api/addresses/:id — actualiza una dirección propia. */
  update(id: string, input: Partial<AddressInput>): Observable<Address> {
    return this.http
      .patch<ApiEnvelope<Address>>(`${this.baseUrl}/${encodeURIComponent(id)}`, input)
      .pipe(map((envelope) => envelope.data));
  }

  /** DELETE /api/addresses/:id — elimina una dirección propia. */
  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiEnvelope<null>>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(map(() => undefined));
  }
}
