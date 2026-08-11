import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CartApiService } from './cart-api.service';
import type { ApiCart } from '../types/cart-api.interface';

const serverCart: ApiCart = {
  items: [
    {
      productId: 'prod-1',
      name: 'Leche Deslactosada',
      price: 1125,
      unitPrice: 1125,
      originalPrice: 1500,
      discountPercentage: 25,
      isOffer: true,
      quantity: 2,
      image: 'leche.jpg',
      unit: 'litro',
      unitQuantity: 1,
    },
  ],
  totalItems: 2,
  subtotal: 2250,
};

describe('CartApiService', () => {
  let service: CartApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(CartApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('getCart GETs /api/cart and unwraps the envelope', () => {
    let result: unknown;
    service.getCart().subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/cart');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: serverCart });
    expect(result).toEqual(serverCart);
  });

  it('addItem POSTs {productId, quantity} to /api/cart/items', () => {
    let result: unknown;
    service.addItem('prod-1', 3).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/cart/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ productId: 'prod-1', quantity: 3 });
    req.flush({ success: true, data: serverCart });
    expect(result).toEqual(serverCart);
  });

  it('addItem defaults quantity to 1', () => {
    service.addItem('prod-1').subscribe();

    const req = httpTesting.expectOne('/api/cart/items');
    expect(req.request.body).toEqual({ productId: 'prod-1', quantity: 1 });
    req.flush({ success: true, data: serverCart });
  });

  it('updateItem PATCHes the absolute quantity to /api/cart/items/:productId', () => {
    let result: unknown;
    service.updateItem('prod-1', 5).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/cart/items/prod-1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ quantity: 5 });
    req.flush({ success: true, data: serverCart });
    expect(result).toEqual(serverCart);
  });

  it('removeItem DELETEs /api/cart/items/:productId', () => {
    let result: unknown;
    service.removeItem('prod-1').subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/cart/items/prod-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, data: serverCart });
    expect(result).toEqual(serverCart);
  });

  it('clearCart DELETEs /api/cart', () => {
    let result: unknown;
    service.clearCart().subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/cart');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, data: { items: [], totalItems: 0, subtotal: 0 } });
    expect(result).toEqual({ items: [], totalItems: 0, subtotal: 0 });
  });

  it('mergeCart POSTs {items} to /api/cart/merge', () => {
    let result: unknown;
    service.mergeCart([{ productId: 'a', quantity: 1 }, { productId: 'b', quantity: 2 }]).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/cart/merge');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ items: [{ productId: 'a', quantity: 1 }, { productId: 'b', quantity: 2 }] });
    req.flush({ success: true, data: serverCart });
    expect(result).toEqual(serverCart);
  });
});