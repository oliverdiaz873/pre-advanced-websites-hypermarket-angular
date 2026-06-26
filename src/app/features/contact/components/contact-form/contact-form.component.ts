/**
 * ContactFormComponent
 *
 * Handles the contact form UI, validation, and submission flow.
 * Uses Reactive Forms with custom validators matching the original Next.js implementation.
 * Emits `onSuccess` after a simulated 1.5s async submission.
 *
 * Dependencies:
 *  - TranslateService (@ngx-translate/core) for i18n error messages
 *  - ToastService for success notifications (handled by parent via onSuccess)
 *
 * Form fields:
 *  - nombre: required, alphabetic (2-50 chars)
 *  - email: required, RFC-compliant regex, max 254 chars
 *  - telefono: optional, 8-15 digits (strips spaces, dashes, parentheses)
 *  - mensaje: required, 10-500 chars
 */
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

function trimmedRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null) return { required: true };
    return value.trim().length > 0 ? null : { required: true };
  };
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, NgClass],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  readonly onSuccess = output<void>();

  isSubmitting = false;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [trimmedRequired(), Validators.minLength(2), Validators.maxLength(50), this.alphabeticValidator]],
    email: ['', [trimmedRequired(), this.emailValidator]],
    mensaje: ['', [trimmedRequired(), Validators.minLength(10), Validators.maxLength(500)]],
    telefono: ['', [this.phoneValidator]]
  });

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors || (!control.touched && !this.isSubmitting)) return '';

    const errors = control.errors;

    if (errors['required']) return this.translate.instant(`contact.validation.${field}.required`);
    if (errors['minlength'] || errors['maxlength']) return this.translate.instant(`contact.validation.${field}.length`);
    if (errors['format']) return this.translate.instant(`contact.validation.${field}.format`);
    if (errors['alphabetic']) return this.translate.instant('contact.validation.name.format');
    if (errors['email']) return this.translate.instant('contact.validation.email.format');

    return '';
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.form.reset({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
      this.onSuccess.emit();
    }, 1500);
  }

  private alphabeticValidator(control: { value: string }) {
    if (!control.value) return null;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(control.value) ? null : { alphabetic: true };
  }

  private emailValidator(control: { value: string }) {
    if (!control.value) return null;
    const trimmed = control.value.trim();
    if (trimmed.length > 254) return { email: true };
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(trimmed) ? null : { email: true };
  }

  private phoneValidator(control: { value: string }) {
    if (!control.value) return null;
    const clean = control.value.replace(/[\s-()]/g, '');
    return /^[0-9]{8,15}$/.test(clean) ? null : { format: true };
  }
}
