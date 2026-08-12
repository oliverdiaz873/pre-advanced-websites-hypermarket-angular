import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@shared/components/toast/toast.service';
import { AddressApiService } from '../../services/address-api.service';
import { AddressListComponent } from '../../components/address-list/address-list.component';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import type { Address, AddressInput } from '../../types/address.interface';

/**
 * Página de gestión de direcciones (E3). Orquesta el CRUD contra el contrato
 * backend (`/api/addresses`): listar, crear, editar, eliminar y cambiar default.
 * Estados loading / empty / error / form. Tras cada mutación recarga desde el
 * servidor (server-wins) para no quedar desincronizado.
 */
@Component({
  selector: 'app-addresses-page',
  standalone: true,
  imports: [CommonModule, AddressListComponent, AddressFormComponent, TranslatePipe],
  templateUrl: './addresses-page.component.html',
  styleUrl: './addresses-page.component.scss',
})
export class AddressesPageComponent {
  private readonly api = inject(AddressApiService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly addresses = signal<Address[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly editingAddress = signal<Address | null>(null);
  readonly saving = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.list().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  openCreate(): void {
    this.editingAddress.set(null);
    this.showForm.set(true);
  }

  openEdit(address: Address): void {
    this.editingAddress.set(address);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingAddress.set(null);
  }

  onSubmitted(input: AddressInput): void {
    if (this.saving()) return;
    this.saving.set(true);

    const operation = this.editingAddress()
      ? this.api.update(this.editingAddress()!.id, input)
      : this.api.create(input);

    operation.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.toast.error(this.translate.instant('addresses.errors.generic'));
      },
    });
  }

  onSetDefault(address: Address): void {
    if (address.isDefault) return;
    this.api.update(address.id, { isDefault: true }).subscribe({
      next: () => this.load(),
      error: () => this.toast.error(this.translate.instant('addresses.errors.generic')),
    });
  }

  onDelete(address: Address): void {
    this.api.delete(address.id).subscribe({
      next: () => this.load(),
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toast.error(this.translate.instant('addresses.errors.unauthenticated'));
          return;
        }
        this.toast.error(this.translate.instant('addresses.errors.delete'));
      },
    });
  }
}
