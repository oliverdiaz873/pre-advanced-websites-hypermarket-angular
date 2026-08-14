import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { getApiBaseUrl } from './api.config';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getProducts envía query params a /products', () => {
    service.getProducts({ page: 2, limit: 20, category: 'bebidas' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${getApiBaseUrl()}/products`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('20');
    expect(req.request.params.get('category')).toBe('bebidas');
    req.flush({ success: true, data: [], pagination: { page: 2, limit: 20, total: 0, pages: 1 } });
  });

  it('getProducts propaga ?featured=true (E4.6)', () => {
    service.getProducts({ featured: true }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${getApiBaseUrl()}/products`);
    expect(req.request.params.get('featured')).toBe('true');
    req.flush({ success: true, data: [], pagination: { page: 1, limit: 50, total: 0, pages: 1 } });
  });

  it('getProducts omite featured cuando no se indica', () => {
    service.getProducts({ page: 1 }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${getApiBaseUrl()}/products`);
    expect(req.request.params.has('featured')).toBe(false);
    req.flush({ success: true, data: [], pagination: { page: 1, limit: 50, total: 0, pages: 1 } });
  });

  it('getProduct codifica el id y apunta a /products/:id', () => {
    service.getProduct('manzanas_verdes').subscribe();

    const req = httpMock.expectOne(`${getApiBaseUrl()}/products/manzanas_verdes`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: { id: 'manzanas_verdes' } });
  });

  it('getOffers apunta a /offers', () => {
    service.getOffers().subscribe();

    const req = httpMock.expectOne(`${getApiBaseUrl()}/offers`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [] });
  });

  it('search envía q y category, sin paginación', () => {
    service.search({ q: 'coca', category: 'bebidas' }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${getApiBaseUrl()}/search`);
    expect(req.request.params.get('q')).toBe('coca');
    expect(req.request.params.get('category')).toBe('bebidas');
    expect(req.request.params.has('page')).toBe(false);
    req.flush({ success: true, data: [] });
  });

  it('getCategories apunta a /categories', () => {
    service.getCategories().subscribe();

    const req = httpMock.expectOne(`${getApiBaseUrl()}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [] });
  });
});