import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { OrdersPageComponent } from './orders-page.component';
import { OrderApiService } from '../../services/order-api.service';
import { TranslateService } from '@ngx-translate/core';
import type { Order } from '../../types/order.interface';

const order: Order = {
  id: 'ord-1',
  userId: 'u-1',
  orderNumber: 'HM-20260812-000001',
  items: [],
  shippingAddress: { street: 'Calle 1', city: 'Santo Domingo' },
  totalItems: 0,
  subtotal: 0,
  status: 'pending',
  paymentStatus: 'pending',
  statusHistory: [],
  createdAt: '2026-08-12T10:00:00.000Z',
  updatedAt: '2026-08-12T10:00:00.000Z',
};

describe('OrdersPageComponent', () => {
  let api: { list: ReturnType<typeof vi.fn> };
  let translate: Record<string, unknown>;

  function configure(): void {
    TestBed.configureTestingModule({
      imports: [OrdersPageComponent],
      providers: [
        provideRouter([]),
        { provide: OrderApiService, useValue: api },
        { provide: TranslateService, useValue: translate },
      ],
    });
  }

  beforeEach(() => {
    api = { list: vi.fn(() => of([order])) };
    translate = { instant: vi.fn((key: string) => key), translate: (key: string) => () => key };
  });

  it('shows the empty history when there are no orders', () => {
    api.list = vi.fn(() => of([]));
    configure();
    const fixture = TestBed.createComponent(OrdersPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.orders()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('orders.empty');
  });

  it('renders the order history with order numbers', () => {
    configure();
    const fixture = TestBed.createComponent(OrdersPageComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('HM-20260812-000001');
  });

  it('links each order to its detail page', () => {
    configure();
    const fixture = TestBed.createComponent(OrdersPageComponent);
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('a.orders-page__link');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toContain('/orders/ord-1');
  });

  it('shows the loading state while the request is pending', () => {
    api.list = vi.fn(() => new Subject<Order[]>().asObservable());
    configure();
    const fixture = TestBed.createComponent(OrdersPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.loading()).toBe(true);
  });

  it('shows the error state when the request fails', () => {
    api.list = vi.fn(() => throwError(() => new Error('boom')));
    configure();
    const fixture = TestBed.createComponent(OrdersPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.error()).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('orders.errors.generic');
  });
});
