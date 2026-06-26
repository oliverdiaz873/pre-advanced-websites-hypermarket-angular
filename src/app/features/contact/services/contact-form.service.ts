/**
 * ContactFormService
 *
 * Encapsulates validation rules and error message resolution for the contact form.
 * Designed to be framework-agnostic — no UI logic, no form state.
 * TranslateService is passed as a parameter (not injected) to keep the service
 * reusable across different i18n contexts.
 *
 * Maps validation error types to translation keys via errorKeyMap:
 *  - required -> required
 *  - minlength / maxlength -> length
 *  - format / alphabetic / email -> format
 *
 * Validators:
 *  - trimmedRequired: rejects empty or whitespace-only strings
 *  - alphabeticValidator: letters + Spanish accents + spaces only
 *  - emailValidator: RFC-compliant regex, max 254 chars
 *  - phoneValidator: 8-15 digits, strips spaces/dashes/parentheses
 */
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

const errorKeyMap: Record<string, string> = {
  required: 'required',
  minlength: 'length',
  maxlength: 'length',
  format: 'format',
  alphabetic: 'format',
  email: 'format'
};

function trimmedRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null) return { required: true };
    return String(value).trim().length > 0 ? null : { required: true };
  };
}

@Injectable({ providedIn: 'root' })
export class ContactFormService {
  trimmedRequired = trimmedRequired;

  alphabeticValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) ? null : { alphabetic: true };
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const trimmed = String(value).trim();
    if (trimmed.length > 254) return { email: true };
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(trimmed) ? null : { email: true };
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const clean = String(value).replace(/[\s-()]/g, '');
    return /^[0-9]{8,15}$/.test(clean) ? null : { format: true };
  }

  getFieldError(
    form: FormGroup,
    field: string,
    isSubmitting: boolean,
    translate: TranslateService
  ): string {
    const control = form.get(field);
    if (!control || !control.errors || (!control.touched && !isSubmitting)) return '';

    const errorType = Object.keys(control.errors).find(k => control.errors?.[k]);
    const key = errorType ? errorKeyMap[errorType] : undefined;

    return key ? translate.instant(`contact.validation.${field}.${key}`) : '';
  }
}
