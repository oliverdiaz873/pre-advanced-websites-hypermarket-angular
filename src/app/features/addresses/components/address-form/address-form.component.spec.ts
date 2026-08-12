import { TestBed } from '@angular/core/testing';
import { AddressFormComponent } from './address-form.component';
import { TranslateService } from '@ngx-translate/core';
import type { Address } from '../../types/address.interface';

describe('AddressFormComponent', () => {
  let translate: Record<string, unknown>;

  beforeEach(() => {
    translate = {
      instant: vi.fn((key: string) => key),
    };
  });

  function create(address?: Address | null) {
    TestBed.configureTestingModule({
      imports: [AddressFormComponent],
      providers: [{ provide: TranslateService, useValue: translate }],
    });
    const fixture = TestBed.createComponent(AddressFormComponent);
    if (address) {
      fixture.componentRef.setInput('address', address);
    }
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('creates an empty form for a new address', () => {
    const { component } = create();
    expect(component.isEditing).toBe(false);
    const raw = component.form.getRawValue();
    expect(raw.label).toBe('');
    expect(raw.isDefault).toBe(false);
  });

  it('populates the form when editing an existing address', () => {
    const address: Address = {
      id: 'addr-1',
      userId: 'u-1',
      label: 'Casa',
      street: 'Calle 1',
      city: 'Santo Domingo',
      state: 'Distrito Nacional',
      zipCode: '10101',
      country: 'República Dominicana',
      reference: 'Cerca del parque',
      isDefault: true,
    };
    const { component } = create(address);
    expect(component.isEditing).toBe(true);
    expect(component.form.getRawValue().label).toBe('Casa');
    expect(component.form.getRawValue().reference).toBe('Cerca del parque');
    expect(component.form.getRawValue().isDefault).toBe(true);
  });

  it('marks fields as touched and does not emit when invalid', () => {
    const { component } = create();
    let emitted = false;
    component.submitted.subscribe(() => (emitted = true));

    component.submit();
    expect(emitted).toBe(false);
    expect(component.form.get('label')?.touched).toBe(true);
  });

  it('emits a trimmed AddressInput when valid', () => {
    const { component } = create();
    let emitted: unknown;
    component.submitted.subscribe((value) => (emitted = value));

    component.form.setValue({
      label: ' Casa ',
      street: ' Calle 1 ',
      city: 'Santo Domingo',
      state: 'Distrito Nacional',
      zipCode: '10101',
      country: 'República Dominicana',
      reference: '',
      isDefault: false,
    });
    component.submit();

    expect(emitted).toEqual({
      label: 'Casa',
      street: 'Calle 1',
      city: 'Santo Domingo',
      state: 'Distrito Nacional',
      zipCode: '10101',
      country: 'República Dominicana',
      isDefault: false,
    });
  });

  it('emits cancelled when cancel is pressed', () => {
    const { component } = create();
    let cancelled = false;
    component.cancelled.subscribe(() => (cancelled = true));
    component.cancel();
    expect(cancelled).toBe(true);
  });
});
