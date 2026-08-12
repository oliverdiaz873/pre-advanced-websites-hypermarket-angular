import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import type { Address } from '../../types/address.interface';

/**
 * Lista de direcciones (E3). Presentacional: muestra tarjetas con el badge de
 * predeterminada, selección (checkout) y acciones de editar/eliminar/predeterminar.
 */
@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss',
})
export class AddressListComponent {
  /** Direcciones del usuario. */
  readonly addresses = input<Address[]>([]);
  /** Dirección seleccionada (modo selección/checkout). */
  readonly selectedId = input<string | null>(null);
  /** Habilita la selección de una dirección (checkout). */
  readonly selectable = input(false);
  /** Muestra las acciones editar/eliminar/predeterminar (página de direcciones). */
  readonly showActions = input(true);

  /** Selecciona una dirección (solo con `selectable`). */
  readonly select = output<Address>();
  readonly edit = output<Address>();
  readonly delete = output<Address>();
  readonly setDefault = output<Address>();

  onSelect(address: Address): void {
    if (!this.selectable()) return;
    this.select.emit(address);
  }
}
