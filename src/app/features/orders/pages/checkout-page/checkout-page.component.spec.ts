import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CheckoutPageComponent } from './checkout-page.component';
import { OrderApiService } from '../../services/order-api.service';
import { AddressApiService } from '@features/addresses/services/address-api.service';
import { CartService } from '@features/cart/services/cart.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import type { Address } from '@features/addresses/types/address.interface';
import type { CartItem } from '@features/cart/types/cart.interface';
import type { Order } from '../../types/order.interface';

const address: Address = {
  id: 'addr-1',
  userId: 'u-1',
  label: 'Casa',
  street: 'Calle 1',
  city: 'Santo Domingo',
  state: 'Distrito Nacional',
  zipCode: '10101',
  country: 'República Dominicana',
  isDefault: true,
};

const order: Order = {
  id: 'ord-1',
  userId: 'u-1',
  orderNumber: 'HM-20260812-000001',
  items: [],
  shippingAddress: { street: 'Calle 1', city: 'Santo Domingo' },
  totalItems: 2,
  subtotal: 2250,
  status: 'pending',
  paymentStatus: 'pending',
  statusHistory: [],
  createdAt: '2026-08-12T10:00:00.000Z',
  updatedAt: '2026-08-12T10:00:00.000Z',
};

function httpError(status: number): HttpErrorResponse {
  return new HttpErrorResponse({ status, statusText: 'error' });
}

describe('CheckoutPageComponent', () => {
  let api: { create: ReturnType<typeof vi.fn> };
  let addressApi: { list: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  let toast: { error: ReturnType<typeof vi.fn> };
  let translate: Record<string, unknown>;

  function cartServiceMock(items: CartItem[]) {
    const list = signal<CartItem[]>(items);
    return {
      items: list.asReadonly(),
      totalItems: computed(() => list().reduce((s, i) => s + i.quantity, 0)),
      totalPrice: computed(() => list().reduce((s, i) => s + i.quantity * i.unitPrice, 0)),
    };
  }

  function configure(cartItems: CartItem[] = [
    { productId: 'p1', name: 'Leche', unitPrice: 1125, unitLabel: 'litro', imagen: 'leche.jpg', quantity: 2 },
  ]): void {
    TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [
        provideRouter([
          { path: 'login', children: [] },
          { path: 'orders/:id', children: [] },
        ]),
        { provide: OrderApiService, useValue: api },
        { provide: AddressApiService, useValue: addressApi },
        { provide: CartService, useValue: cartServiceMock(cartItems) },
        { provide: ToastService, useValue: toast },
        { provide: TranslateService, useValue: translate },
      ],
    });
  }

  beforeEach(() => {
    api = { create: vi.fn(() => of(order)) };
    addressApi = {
      list: vi.fn(() => of([address])),
      create: vi.fn(() => of(address)),
    };
    toast = { error: vi.fn() };
    translate = { instant: vi.fn((key: string) => key), translate: (key: string) => () => key };
  });

  it('generates an idempotencyKey on mount and it exists', () => {
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    const key = fixture.componentInstance.idempotencyKey;
    expect(key).toBeTruthy();
    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(0);
  });

  it('reuses EXACTLY the same idempotencyKey across retries after a 409', () => {
    api.create = vi.fn(() => throwError(() => httpError(409)));
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const key = component.idempotencyKey;

    component.confirmOrder();
    component.confirmOrder();
    component.confirmOrder();

    expect(api.create).toHaveBeenCalledTimes(3);
    const calls = api.create.mock.calls as [object][];
    for (const [payload] of calls) {
      expect(payload).toEqual({ addressId: 'addr-1', idempotencyKey: key });
    }
    expect(component.idempotencyKey).toBe(key);
  });

  it('does NOT generate a new idempotencyKey after an error', () => {
    api.create = vi.fn(() => throwError(() => httpError(500)));
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const before = component.idempotencyKey;
    component.confirmOrder();
    expect(component.idempotencyKey).toBe(before);
  });

  it('shows the stock message on 409', () => {
    api.create = vi.fn(() => throwError(() => httpError(409)));
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.confirmOrder();
    expect(fixture.componentInstance.submitError()).toBe('checkout.errors.insufficient_stock');
  });

  it('shows the cart empty message on 400', () => {
    api.create = vi.fn(() => throwError(() => httpError(400)));
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.confirmOrder();
    expect(fixture.componentInstance.submitError()).toBe('checkout.errors.cart_empty');
  });

  it('navigates to login with returnUrl on 401', async () => {
    api.create = vi.fn(() => throwError(() => httpError(401)));
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);

    fixture.componentInstance.confirmOrder();
    await fixture.whenStable();

    expect(router.url).toContain('/login');
    expect(router.url).toContain('returnUrl');
    expect(router.url).toContain(encodeURIComponent('/checkout'));
  });

  it('navigates to the order detail on success', async () => {
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);

    fixture.componentInstance.confirmOrder();
    await fixture.whenStable();

    expect(api.create).toHaveBeenCalledWith({ addressId: 'addr-1', idempotencyKey: fixture.componentInstance.idempotencyKey });
    expect(router.url).toContain('/orders/ord-1');
  });

  it('blocks confirmation when the cart is empty', () => {
    configure([]);
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.isCartEmpty()).toBe(true);
    component.confirmOrder();
    expect(api.create).not.toHaveBeenCalled();
    expect(component.submitError()).toBe('checkout.errors.cart_empty');
  });

  it('requires a selected address before confirming', async () => {
    addressApi.list = vi.fn(() => of([]));
    configure();
    const fixture = TestBed.createComponent(CheckoutPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.selectedAddressId()).toBeNull();
    component.confirmOrder();
    await fixture.whenStable();
    expect(api.create).not.toHaveBeenCalled();
    expect(component.submitError()).toBe('checkout.errors.no_address');
  });
});
