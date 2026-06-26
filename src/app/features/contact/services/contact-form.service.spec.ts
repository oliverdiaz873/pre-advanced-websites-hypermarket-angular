import { ContactFormService } from './contact-form.service';
import { FormControl, FormGroup } from '@angular/forms';

describe('ContactFormService', () => {
  let service: ContactFormService;

  beforeEach(() => {
    service = new ContactFormService();
  });

  describe('trimmedRequired', () => {
    it('should return required error for null value', () => {
      const control = new FormControl(null);
      expect(service.trimmedRequired()(control)).toEqual({ required: true });
    });

    it('should return required error for undefined value', () => {
      const control = new FormControl(undefined);
      expect(service.trimmedRequired()(control)).toEqual({ required: true });
    });

    it('should return required error for empty string', () => {
      const control = new FormControl('');
      expect(service.trimmedRequired()(control)).toEqual({ required: true });
    });

    it('should return required error for whitespace-only string', () => {
      const control = new FormControl('   ');
      expect(service.trimmedRequired()(control)).toEqual({ required: true });
    });

    it('should return null for valid string', () => {
      const control = new FormControl('Juan');
      expect(service.trimmedRequired()(control)).toBeNull();
    });
  });

  describe('alphabeticValidator', () => {
    it('should return null for letters with accents', () => {
      const control = new FormControl('José María');
      expect(service.alphabeticValidator(control)).toBeNull();
    });

    it('should return alphabetic error for numbers', () => {
      const control = new FormControl('Juan123');
      expect(service.alphabeticValidator(control)).toEqual({ alphabetic: true });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(service.alphabeticValidator(control)).toBeNull();
    });
  });

  describe('emailValidator', () => {
    it('should return null for valid email', () => {
      const control = new FormControl('user@domain.com');
      expect(service.emailValidator(control)).toBeNull();
    });

    it('should return email error for invalid format', () => {
      const control = new FormControl('bad@');
      expect(service.emailValidator(control)).toEqual({ email: true });
    });

    it('should return email error for value longer than 254 chars', () => {
      const control = new FormControl('a'.repeat(255) + '@domain.com');
      expect(service.emailValidator(control)).toEqual({ email: true });
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(service.emailValidator(control)).toBeNull();
    });
  });

  describe('phoneValidator', () => {
    it('should return null for valid phone', () => {
      const control = new FormControl('8095555555');
      expect(service.phoneValidator(control)).toBeNull();
    });

    it('should return null for phone with formatting', () => {
      const control = new FormControl('(809) 555-5555');
      expect(service.phoneValidator(control)).toBeNull();
    });

    it('should return format error for non-numeric characters', () => {
      const control = new FormControl('12abc');
      expect(service.phoneValidator(control)).toEqual({ format: true });
    });

    it('should return null for empty value (optional field)', () => {
      const control = new FormControl('');
      expect(service.phoneValidator(control)).toBeNull();
    });
  });

  describe('getFieldError', () => {
    it('should return empty string for non-existent control', () => {
      const form = new FormGroup({});
      const translate = { instant: vi.fn() };
      expect(service.getFieldError(form, 'nombre', false, translate as any)).toBe('');
      expect(translate.instant).not.toHaveBeenCalled();
    });

    it('should return empty string when control has no errors', () => {
      const form = new FormGroup({ nombre: new FormControl('Juan') });
      const translate = { instant: vi.fn() };
      expect(service.getFieldError(form, 'nombre', false, translate as any)).toBe('');
      expect(translate.instant).not.toHaveBeenCalled();
    });

    it('should return empty string when control is not touched and not submitting', () => {
      const form = new FormGroup({ nombre: new FormControl('') });
      form.get('nombre')!.markAsUntouched();
      const translate = { instant: vi.fn().mockReturnValue('Required field') };
      expect(service.getFieldError(form, 'nombre', false, translate as any)).toBe('');
      expect(translate.instant).not.toHaveBeenCalled();
    });

    it('should return translated error when control is touched', () => {
      const form = new FormGroup({ nombre: new FormControl('') });
      const control = form.get('nombre')!;
      control.setErrors({ required: true });
      control.markAsTouched();
      const translate = { instant: vi.fn().mockReturnValue('Required field') };
      const result = service.getFieldError(form, 'nombre', false, translate as any);
      expect(result).toBe('Required field');
      expect(translate.instant).toHaveBeenCalledOnce();
      expect(translate.instant).toHaveBeenCalledWith('contact.validation.nombre.required');
    });

    it('should return translated error when isSubmitting is true (even if not touched)', () => {
      const form = new FormGroup({ nombre: new FormControl('') });
      const control = form.get('nombre')!;
      control.setErrors({ required: true });
      const translate = { instant: vi.fn().mockReturnValue('Required field') };
      const result = service.getFieldError(form, 'nombre', true, translate as any);
      expect(result).toBe('Required field');
      expect(translate.instant).toHaveBeenCalledOnce();
      expect(translate.instant).toHaveBeenCalledWith('contact.validation.nombre.required');
    });
  });
});
