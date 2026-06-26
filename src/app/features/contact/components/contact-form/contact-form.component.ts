/**
 * ContactFormComponent
 *
 * Handles the contact form UI, validation, and submission flow.
 * Uses Reactive Forms with custom validators matching the original Next.js implementation.
 * Emits `onSuccess` after a simulated 1.5s async submission.
 *
 * Dependencies:
 *  - ContactFormService for validation rules and error translation
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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { ContactFormService } from '../../services/contact-form.service';

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
  private readonly validation = inject(ContactFormService);

  readonly onSuccess = output<void>();

  isSubmitting = false;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [this.validation.trimmedRequired(), Validators.minLength(2), Validators.maxLength(50), this.validation.alphabeticValidator]],
    email: ['', [this.validation.trimmedRequired(), this.validation.emailValidator]],
    mensaje: ['', [this.validation.trimmedRequired(), Validators.minLength(10), Validators.maxLength(500)]],
    telefono: ['', [this.validation.phoneValidator]]
  });

  getFieldError(field: string): string {
    return this.validation.getFieldError(this.form, field, this.isSubmitting, this.translate);
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
}
