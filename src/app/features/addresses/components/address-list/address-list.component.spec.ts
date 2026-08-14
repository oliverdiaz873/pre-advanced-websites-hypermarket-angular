import { TestBed } from '@angular/core/testing';
import { AddressListComponent } from './address-list.component';
import { TranslateService } from '@ngx-translate/core';
import type { Address } from '../../types/address.interface';

const addresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'u-1',
    label: 'Casa',
    street: 'Calle 1',
    city: 'Santo Domingo',
    state: 'Distrito Nacional',
    zipCode: '10101',
    country: 'República Dominicana',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'u-1',
    label: 'Oficina',
    street: 'Av. 2',
    city: 'Santiago',
    state: 'Santiago',
    zipCode: '51000',
    country: 'República Dominicana',
    isDefault: false,
  },
];

describe('AddressListComponent', () => {
  function create(inputs?: { addresses?: Address[]; selectable?: boolean; showActions?: boolean }) {
    TestBed.configureTestingModule({
      imports: [AddressListComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: { instant: (k: string) => k, translate: (k: string) => () => k },
        },
      ],
    });
    const fixture = TestBed.createComponent(AddressListComponent);
    if (inputs?.addresses !== undefined) fixture.componentRef.setInput('addresses', inputs.addresses);
    if (inputs?.selectable !== undefined) fixture.componentRef.setInput('selectable', inputs.selectable);
    if (inputs?.showActions !== undefined) fixture.componentRef.setInput('showActions', inputs.showActions);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('renders each address card', () => {
    const { fixture } = create({ addresses });
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Casa');
    expect(text).toContain('Oficina');
    expect(text).toContain('Calle 1');
  });

  it('renders an empty list when there are no addresses', () => {
    const { fixture } = create({ addresses: [] });
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.address-list__item').length).toBe(0);
  });

  it('emits select on card click when selectable', () => {
    const { component } = create({ selectable: true });
    let selected: Address | undefined;
    component.select.subscribe((a) => (selected = a));
    component.onSelect(addresses[1]);
    expect(selected?.id).toBe('addr-2');
  });

  it('does not emit select when not selectable', () => {
    const { component } = create();
    let emitted = false;
    component.select.subscribe(() => (emitted = true));
    component.onSelect(addresses[1]);
    expect(emitted).toBe(false);
  });

  it('emits edit, delete and setDefault from the action buttons', () => {
    const { component } = create();
    let edited: Address | undefined;
    let deleted: Address | undefined;
    let defauled: Address | undefined;
    component.edit.subscribe((a) => (edited = a));
    component.delete.subscribe((a) => (deleted = a));
    component.setDefault.subscribe((a) => (defauled = a));

    component.edit.emit(addresses[1]);
    component.delete.emit(addresses[1]);
    component.setDefault.emit(addresses[1]);
    expect(edited?.id).toBe('addr-2');
    expect(deleted?.id).toBe('addr-2');
    expect(defauled?.id).toBe('addr-2');
  });
});
