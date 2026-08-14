import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiBaseUrl } from './api.config';
import {
  ApiCategory,
  ApiCollection,
  ApiContactMessage,
  ApiContactPayload,
  ApiEnvelope,
  ApiOffer,
  ApiPaginationParams,
  ApiProduct,
} from './api-types';

export type {
  ApiCategory,
  ApiCollection,
  ApiContactMessage,
  ApiContactPayload,
  ApiEnvelope,
  ApiOffer,
  ApiPaginationParams,
  ApiProduct,
};

/**
 * Cliente tipado del backend (F5.1). La base URL se toma de api.config y el
 * idioma (`?lang=`) lo estampa el interceptor `api-lang.interceptor`.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private params(extra?: Record<string, string | number | undefined>): HttpParams {
    let params = new HttpParams();
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      }
    }
    return params;
  }

  getProducts(query: ApiPaginationParams = {}): Observable<ApiCollection<ApiProduct>> {
    const extra: Record<string, string | number | undefined> = {
      page: query.page,
      limit: query.limit,
      q: query.q,
      category: query.category,
      brand: query.brand,
      featured: query.featured === true ? 'true' : undefined,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
    return this.http.get<ApiCollection<ApiProduct>>(`${getApiBaseUrl()}/products`, { params: this.params(extra) });
  }

  getProduct(id: string): Observable<ApiEnvelope<ApiProduct>> {
    return this.http.get<ApiEnvelope<ApiProduct>>(`${getApiBaseUrl()}/products/${encodeURIComponent(id)}`);
  }

  getOffers(): Observable<ApiEnvelope<ApiOffer[]>> {
    return this.http.get<ApiEnvelope<ApiOffer[]>>(`${getApiBaseUrl()}/offers`);
  }

  search(query: ApiPaginationParams = {}): Observable<ApiEnvelope<ApiProduct[]>> {
    const params = this.params({ q: query.q, category: query.category });
    return this.http.get<ApiEnvelope<ApiProduct[]>>(`${getApiBaseUrl()}/search`, { params });
  }

  getCategories(): Observable<ApiEnvelope<ApiCategory[]>> {
    return this.http.get<ApiEnvelope<ApiCategory[]>>(`${getApiBaseUrl()}/categories`);
  }

  /** E4.5: envía un mensaje de contacto (POST /api/contact, limitado a 10/60s por IP). */
  sendContactMessage(payload: ApiContactPayload): Observable<ApiEnvelope<ApiContactMessage>> {
    return this.http.post<ApiEnvelope<ApiContactMessage>>(
      `${getApiBaseUrl()}/contact`,
      payload,
    );
  }
}