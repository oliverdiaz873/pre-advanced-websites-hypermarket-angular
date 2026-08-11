import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getApiBaseUrl } from '@core/api/api.config';
import type { ApiEnvelope } from '@core/api/api-types';
import type { ApiCart, CartMergeItem } from '../types/cart-api.interface';

/**
 * Cliente HTTP del contrato cart (B2). El `withCredentials: true` lo estampa el
 * interceptor `authInterceptor` para que la cookie httpOnly viaje en cada
 * request dirigido a `/api/`. Todas las mutaciones devuelven el `CartResponse`
 * canónico (`{ success, data }`) que el CartService reconcilia contra su estado.
 */
@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${getApiBaseUrl()}/cart`;

  /** GET /api/cart — carrito completo del usuario autenticado. */
  getCart(): Observable<ApiCart> {
    return this.http.get<ApiEnvelope<ApiCart>>(this.baseUrl).pipe(map((envelope) => envelope.data));
  }

  /** POST /api/cart/items — agrega (incrementa) un item. */
  addItem(productId: string, quantity = 1): Observable<ApiCart> {
    return this.http
      .post<ApiEnvelope<ApiCart>>(`${this.baseUrl}/items`, { productId, quantity })
      .pipe(map((envelope) => envelope.data));
  }

  /** PATCH /api/cart/items/:productId — cantidad ABSOLUTA (set, no delta). */
  updateItem(productId: string, quantity: number): Observable<ApiCart> {
    return this.http
      .patch<ApiEnvelope<ApiCart>>(`${this.baseUrl}/items/${productId}`, { quantity })
      .pipe(map((envelope) => envelope.data));
  }

  /** DELETE /api/cart/items/:productId */
  removeItem(productId: string): Observable<ApiCart> {
    return this.http
      .delete<ApiEnvelope<ApiCart>>(`${this.baseUrl}/items/${productId}`)
      .pipe(map((envelope) => envelope.data));
  }

  /** DELETE /api/cart — vacía el carrito server-side. */
  clearCart(): Observable<ApiCart> {
    return this.http.delete<ApiEnvelope<ApiCart>>(this.baseUrl).pipe(map((envelope) => envelope.data));
  }

  /** POST /api/cart/merge — merge guest→server (server-wins), una sola llamada. */
  mergeCart(items: CartMergeItem[]): Observable<ApiCart> {
    return this.http
      .post<ApiEnvelope<ApiCart>>(`${this.baseUrl}/merge`, { items })
      .pipe(map((envelope) => envelope.data));
  }
}