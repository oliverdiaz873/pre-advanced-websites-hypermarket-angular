import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { AddressesPageComponent } from './addresses-page.component';
import { AddressApiService } from '../../services/address-api.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import type { Address } from '../../types/address.interface';

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

describe('AddressesPageComponent', () => {
  let api: {
    list: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let toast: { error: ReturnType<typeof vi.fn> };
  let translate: Record<string, unknown>;

  function configure(): void {
    TestBed.configureTestingModule({
      imports: [AddressesPageComponent],
      providers: [
        { provide: AddressApiService, useValue: api },
        { provide: ToastService, useValue: toast },
        { provide: TranslateService, useValue: translate },
      ],
    });
  }

  beforeEach(() => {
    api = {
      list: vi.fn(() => of([address])),
      create: vi.fn(() => of(address)),
      update: vi.fn(() => of(address)),
      delete: vi.fn(() => of(undefined)),
    };
    toast = { error: vi.fn() };
    translate = {
      instant: vi.fn((key: string) => key),
    };
  });

  it('renders the address list when the API returns addresses', () => {
    configure();
    const fixture = TestBed.createComponent(AddressesPageComponent);
    fixture.detectChanges();

    expect(api.list).toHaveBeenCalled();
    expect(fixture.componentInstance.addresses()).toEqual([address]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Casa');
  });

  it('shows the empty state when there are no addresses', () => {
    api.list = vi.fn(() => of([]));
    configure();
    const fixture = TestBed.createComponent(AddressesPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.addresses()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('addresses.empty');
  });

  it('shows the loading state while the request is pending', () => {
    const pending = new Subject<Address[]>();
    api.list = vi.fn(() => pending.asObservable());
    configure();
    const fixture = TestBed.createComponent(AddressesPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.loading()).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('addresses.loading');
  });

  it('shows the error state when the request fails', () => {
    api.list = vi.fn(() => throwError(() => new Error('boom')));
    configure();
    const fixture = TestBed.createComponent(AddressesPageComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.error()).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('addresses.errors.load');
  });

  it('opens the create form and submits a new address', () => {
    configure();
    const fixture = TestBed.createComponent(AddressesPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.openCreate();
    fixture.detectChanges();
    expect(component.showForm()).toBe(true);
    expect(component.editingAddress()).toBeNull();

    component.onSubmitted({
      label: 'Oficina',
      street: 'Av. 2',
      city: 'Santiago',
      state: 'Santiago',
      zipCode: '51000',
      country: 'República Dominicana',
      isDefault: false,
    });
    expect(api.create).toHaveBeenCalled();
  });

  it('updates an address when editing', () => {
    configure();
    const fixture = TestBed.createComponent(AddressesPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.openEdit(address);
    expect(component.showForm()).toBe(true);
    expect(component.editingAddress()).toEqual(address);

    component.onSubmitted({ ...address, city: 'La Vega' });
    expect(api.update).toHaveBeenCalledWith('addr-1', { ...address, city: 'La Vega' });
  });

  it('sets default and deletes an address through the API', () => {
    configure();
    const fixture = TestBed.createComponent(AddressesPageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.onSetDefault({ ...address, isDefault: false });
    expect(api.update).toHaveBeenCalledWith('addr-1', { isDefault: true });

    component.onDelete(address);
    expect(api.delete).toHaveBeenCalledWith('addr-1');
  });
});
