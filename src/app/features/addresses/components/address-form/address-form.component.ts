import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import type { Address, AddressInput } from '../../types/address.interface';

/**
 * Formulario de dirección (E3). Es presentacional: recibe una `Address` opcional
 * (modo edición) y emite el `AddressInput` del contrato al enviar. La llamada al
 * API la orquesta el contenedor (addresses-page o checkout-page).
 */
@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly translate = inject(TranslateService);

  /** Dirección existente en modo edición; `null`/vacío = creación. */
  readonly address = input<Address | null>(null);
  /** Emite el payload del contrato al guardar. */
  readonly submitted = output<AddressInput>();
  /** Emite cuando el usuario cancela el formulario. */
  readonly cancelled = output<void>();

  readonly form = this.fb.group({
    label: ['', [Validators.required]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required]],
    country: ['', [Validators.required]],
    reference: [''],
    isDefault: [false],
  });

  ngOnInit(): void {
    const address = this.address();
    if (address) {
      this.form.setValue({
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        reference: address.reference ?? '',
        isDefault: address.isDefault,
      });
    }
  }

  get isEditing(): boolean {
    return !!this.address();
  }

  getFieldError(controlName: keyof AddressInput): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) {
      return this.translate.instant(`addresses.validation.${controlName}_required`);
    }
    return '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: AddressInput = {
      label: raw.label.trim(),
      street: raw.street.trim(),
      city: raw.city.trim(),
      state: raw.state.trim(),
      zipCode: raw.zipCode.trim(),
      country: raw.country.trim(),
      isDefault: raw.isDefault,
    };
    if (raw.reference.trim()) {
      payload.reference = raw.reference.trim();
    }

    this.submitted.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
