import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderApiService } from './order-api.service';
import type { CreateOrderInput, Order } from '../types/order.interface';
import type { ShippingAddressSnapshot } from '../../addresses/types/address.interface';

const shipping: ShippingAddressSnapshot = {
  label: 'Casa',
  street: 'Calle 1',
  city: 'Santo Domingo',
  state: 'Distrito Nacional',
  zipCode: '10101',
  country: 'República Dominicana',
};

const serverOrder: Order = {
  id: 'ord-1',
  userId: 'u-1',
  orderNumber: 'HM-20260812-000001',
  idempotencyKey: 'key-1',
  items: [
    {
      productId: 'prod-1',
      name: 'Leche',
      price: 1125,
      originalPrice: 1500,
      discountPercentage: 25,
      image: 'leche.jpg',
      unit: 'litro',
      unitQuantity: 1,
      quantity: 2,
    },
  ],
  shippingAddress: shipping,
  totalItems: 2,
  subtotal: 2250,
  status: 'pending',
  paymentStatus: 'pending',
  statusHistory: [{ status: 'pending', changedAt: '2026-08-12T10:00:00.000Z' }],
  createdAt: '2026-08-12T10:00:00.000Z',
  updatedAt: '2026-08-12T10:00:00.000Z',
};

describe('OrderApiService', () => {
  let service: OrderApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('create POSTs the exact payload {addressId, idempotencyKey} and unwraps data', () => {
    const input: CreateOrderInput = { addressId: 'addr-1', idempotencyKey: 'uuid-A' };
    let result: unknown;
    service.create(input).subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/orders');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ addressId: 'addr-1', idempotencyKey: 'uuid-A' });
    req.flush({ success: true, data: serverOrder });
    expect(result).toEqual(serverOrder);
  });

  it('list GETs /api/orders and unwraps the envelope', () => {
    let result: unknown;
    service.list().subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/orders');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [serverOrder] });
    expect(result).toEqual([serverOrder]);
  });

  it('getById GETs /api/orders/:id and unwraps the envelope', () => {
    let result: unknown;
    service.getById('ord-1').subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/orders/ord-1');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: serverOrder });
    expect(result).toEqual(serverOrder);
  });

  it('pay POSTs /api/orders/:id/pay', () => {
    let result: unknown;
    service.pay('ord-1').subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/orders/ord-1/pay');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { ...serverOrder, paymentStatus: 'paid' } });
    expect((result as Order).paymentStatus).toBe('paid');
  });

  it('cancel PATCHes {status: cancelled} to /api/orders/:id/status', () => {
    let result: unknown;
    service.cancel('ord-1').subscribe((r) => (result = r));

    const req = httpTesting.expectOne('/api/orders/ord-1/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'cancelled' });
    req.flush({ success: true, data: { ...serverOrder, status: 'cancelled' } });
    expect((result as Order).status).toBe('cancelled');
  });

  it('reports 400 cart_empty as an HttpErrorResponse', () => {
    let caught: HttpErrorResponse | undefined;
    service.create({ addressId: 'addr-1', idempotencyKey: 'uuid-A' }).subscribe({
      error: (e: HttpErrorResponse) => (caught = e),
    });

    const req = httpTesting.expectOne('/api/orders');
    req.flush(
      { success: false, message: 'Cart is empty', statusCode: 400, code: 'VALIDATION_ERROR' },
      { status: 400, statusText: 'Bad Request' }
    );
    expect(caught?.status).toBe(400);
  });

  it('reports 401 for an unauthenticated request', () => {
    let caught: HttpErrorResponse | undefined;
    service.list().subscribe({ error: (e: HttpErrorResponse) => (caught = e) });

    const req = httpTesting.expectOne('/api/orders');
    req.flush(
      { success: false, message: 'Unauthorized', statusCode: 401, code: 'UNAUTHORIZED' },
      { status: 401, statusText: 'Unauthorized' }
    );
    expect(caught?.status).toBe(401);
  });

  it('reports 404 when the order does not exist', () => {
    let caught: HttpErrorResponse | undefined;
    service.getById('missing').subscribe({ error: (e: HttpErrorResponse) => (caught = e) });

    const req = httpTesting.expectOne('/api/orders/missing');
    req.flush(
      { success: false, message: 'Order not found', statusCode: 404, code: 'NOT_FOUND' },
      { status: 404, statusText: 'Not Found' }
    );
    expect(caught?.status).toBe(404);
  });

  it('reports 409 insufficient stock as an HttpErrorResponse', () => {
    let caught: HttpErrorResponse | undefined;
    service.create({ addressId: 'addr-1', idempotencyKey: 'uuid-A' }).subscribe({
      error: (e: HttpErrorResponse) => (caught = e),
    });

    const req = httpTesting.expectOne('/api/orders');
    req.flush(
      { success: false, message: 'Insufficient stock', statusCode: 409, code: 'CONFLICT' },
      { status: 409, statusText: 'Conflict' }
    );
    expect(caught?.status).toBe(409);
  });
});
