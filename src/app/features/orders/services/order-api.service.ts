import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getApiBaseUrl } from '@core/api/api.config';
import type { ApiEnvelope } from '@core/api/api-types';
import type { CreateOrderInput, Order } from '../types/order.interface';

/**
 * Cliente HTTP del contrato orders (E3). El `withCredentials: true` lo estampa
 * el interceptor `authInterceptor` (cookie httpOnly). El cliente jamás provee
 * precios/stock: el backend decide todo a partir del carrito server-side.
 */
@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${getApiBaseUrl()}/orders`;

  /** POST /api/orders — checkout con addressId + idempotencyKey obligatorias. */
  create(input: CreateOrderInput): Observable<Order> {
    return this.http
      .post<ApiEnvelope<Order>>(this.baseUrl, input)
      .pipe(map((envelope) => envelope.data));
  }

  /** GET /api/orders — historial plano del usuario (sin paginación). */
  list(): Observable<Order[]> {
    return this.http
      .get<ApiEnvelope<Order[]>>(this.baseUrl)
      .pipe(map((envelope) => envelope.data));
  }

  /** GET /api/orders/:id — detalle de una orden propia. */
  getById(id: string): Observable<Order> {
    return this.http
      .get<ApiEnvelope<Order>>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(map((envelope) => envelope.data));
  }

  /** POST /api/orders/:id/pay — pay stub (pending → paid, una sola vez). */
  pay(id: string): Observable<Order> {
    return this.http
      .post<ApiEnvelope<Order>>(`${this.baseUrl}/${encodeURIComponent(id)}/pay`, {})
      .pipe(map((envelope) => envelope.data));
  }

  /** PATCH /api/orders/:id/status { status: 'cancelled' } — cancelar (customer). */
  cancel(id: string): Observable<Order> {
    return this.http
      .patch<ApiEnvelope<Order>>(`${this.baseUrl}/${encodeURIComponent(id)}/status`, {
        status: 'cancelled',
      })
      .pipe(map((envelope) => envelope.data));
  }
}
