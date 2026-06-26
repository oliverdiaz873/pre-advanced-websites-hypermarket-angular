import { TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

function createValidForm(component: ContactFormComponent): void {
  component.form.setValue({
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '(809) 555-5555',
    mensaje: 'Mensaje de prueba con al menos 10 caracteres'
  });
}

describe('ContactFormComponent', () => {
  let translateService: Record<string, unknown>;

  beforeEach(async () => {
    const onEvent = { subscribe: vi.fn() };
    translateService = {
      instant: vi.fn((key: string) => key),
      translate: vi.fn((key: string) => key),
      get: vi.fn((key: string) => of(key)),
      currentLang: 'es',
      onTranslationChange: onEvent,
      onLangChange: onEvent,
      onDefaultLangChange: onEvent,
      defaultLang: 'es',
      addLangs: vi.fn(),
      getLangs: vi.fn(() => ['es', 'en']),
      setDefaultLang: vi.fn(),
      use: vi.fn(),
      reloadLang: vi.fn(() => Promise.resolve()),
      resetLang: vi.fn(),
      getBrowserLang: vi.fn(() => 'es'),
      getBrowserCultureLang: vi.fn(() => 'es-ES'),
      setTranslation: vi.fn(),
      getTranslation: vi.fn(() => Promise.resolve({})),
      stream: vi.fn((key: string) => key),
    };

    TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        { provide: TranslateService, useValue: translateService }
      ]
    });

    await TestBed.compileComponents();
  });

  describe('validators', () => {
    it('trimmedRequired should reject empty string', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('nombre')!;
      control.setValue('');
      expect(control.hasError('required')).toBe(true);
    });

    it('trimmedRequired should reject whitespace-only string', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('nombre')!;
      control.setValue('   ');
      expect(control.hasError('required')).toBe(true);
    });

    it('trimmedRequired should accept valid string', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('nombre')!;
      control.setValue('Juan');
      expect(control.hasError('required')).toBe(false);
    });

    it('alphabeticValidator should reject string with numbers', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('nombre')!;
      control.setValue('Juan123');
      expect(control.hasError('alphabetic')).toBe(true);
    });

    it('alphabeticValidator should accept string with letters and accents', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('nombre')!;
      control.setValue('José María');
      expect(control.hasError('alphabetic')).toBe(false);
    });

    it('emailValidator should reject invalid email', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('email')!;
      control.setValue('bad@');
      expect(control.hasError('email')).toBe(true);
    });

    it('emailValidator should accept valid email', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('email')!;
      control.setValue('user@domain.com');
      expect(control.hasError('email')).toBe(false);
    });

    it('emailValidator should reject email longer than 254 chars', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('email')!;
      control.setValue('a'.repeat(255) + '@domain.com');
      expect(control.hasError('email')).toBe(true);
    });

    it('phoneValidator should reject invalid phone', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('telefono')!;
      control.setValue('12');
      expect(control.hasError('format')).toBe(true);
    });

    it('phoneValidator should accept valid phone with formatting', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('telefono')!;
      control.setValue('(809) 555-5555');
      expect(control.hasError('format')).toBe(false);
    });

    it('phoneValidator should accept empty phone (optional field)', () => {
      const component = TestBed.createComponent(ContactFormComponent).componentInstance;
      const control = component.form.get('telefono')!;
      control.setValue('');
      expect(control.errors).toBeNull();
    });
  });

  describe('form integration', () => {
    it('should start with invalid form', () => {
      const fixture = TestBed.createComponent(ContactFormComponent);
      const component = fixture.componentInstance;
      expect(component.form.invalid).toBe(true);
    });

    it('should block submit when form is invalid', () => {
      const fixture = TestBed.createComponent(ContactFormComponent);
      const component = fixture.componentInstance;
      const onSuccessSpy = vi.fn();
      component.onSuccess.subscribe(onSuccessSpy);

      component.submit();

      expect(component.isSubmitting).toBe(false);
      expect(onSuccessSpy).not.toHaveBeenCalled();
    });

    it('should set isSubmitting to true and register 1500ms timeout on valid submit', () => {
      vi.useFakeTimers();
      const fixture = TestBed.createComponent(ContactFormComponent);
      const component = fixture.componentInstance;
      createValidForm(component);

      const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
      component.submit();

      expect(component.isSubmitting).toBe(true);
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1500);

      // Execute the timeout callback manually to avoid template rendering
      const callback = setTimeoutSpy.mock.calls[0][0] as () => void;
      callback();

      expect(component.isSubmitting).toBe(false);
      expect(component.form.getRawValue()).toEqual({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
      vi.useRealTimers();
    });

    it('should emit onSuccess after timeout callback executes', () => {
      vi.useFakeTimers();
      const fixture = TestBed.createComponent(ContactFormComponent);
      const component = fixture.componentInstance;
      const onSuccessSpy = vi.fn();
      component.onSuccess.subscribe(onSuccessSpy);
      createValidForm(component);

      const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
      component.submit();

      const callback = setTimeoutSpy.mock.calls[0][0] as () => void;
      callback();

      expect(onSuccessSpy).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it('should block submit when nombre contains only whitespace', () => {
      const fixture = TestBed.createComponent(ContactFormComponent);
      const component = fixture.componentInstance;
      const onSuccessSpy = vi.fn();
      component.onSuccess.subscribe(onSuccessSpy);

      component.form.setValue({
        nombre: '   ',
        email: 'user@domain.com',
        telefono: '',
        mensaje: 'Mensaje válido con al menos diez caracteres'
      });

      expect(component.form.invalid).toBe(true);

      component.submit();
      expect(onSuccessSpy).not.toHaveBeenCalled();
    });
  });
});
