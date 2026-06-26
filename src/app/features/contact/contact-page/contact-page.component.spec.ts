import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ContactPageComponent } from './contact-page.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

describe('ContactPageComponent', () => {
  let toastService: { success: ReturnType<typeof vi.fn> };
  let translateService: Record<string, unknown>;

  function configureTestingModule(platformId: string): void {
    TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: ToastService, useValue: toastService },
        { provide: TranslateService, useValue: translateService }
      ]
    });
  }

  beforeEach(() => {
    document.body.classList.remove('dark-theme-body');

    toastService = { success: vi.fn() };
    translateService = {
      instant: vi.fn((key: string) => key),
      get: vi.fn(),
      stream: vi.fn(),
      translate: vi.fn(),
      currentLang: 'es',
      onTranslationChange: { subscribe: vi.fn() },
      onLangChange: { subscribe: vi.fn() },
      onDefaultLangChange: { subscribe: vi.fn() },
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
    };
  });

  afterEach(() => {
    document.body.classList.remove('dark-theme-body');
  });

  describe('dark theme', () => {
    it('should add dark-theme-body on init in browser', () => {
      configureTestingModule('browser');
      const component = TestBed.createComponent(ContactPageComponent).componentInstance;

      component.ngOnInit();

      expect(document.body.classList.contains('dark-theme-body')).toBe(true);
    });

    it('should remove dark-theme-body on destroy in browser', () => {
      configureTestingModule('browser');
      const component = TestBed.createComponent(ContactPageComponent).componentInstance;

      component.ngOnInit();
      component.ngOnDestroy();

      expect(document.body.classList.contains('dark-theme-body')).toBe(false);
    });

    it('should NOT modify body when on server', () => {
      configureTestingModule('server');
      const component = TestBed.createComponent(ContactPageComponent).componentInstance;

      component.ngOnInit();
      expect(document.body.classList.contains('dark-theme-body')).toBe(false);

      component.ngOnDestroy();
      expect(document.body.classList.contains('dark-theme-body')).toBe(false);
    });
  });

  describe('toast', () => {
    it('showSuccessToast should call toast.success with translated message', () => {
      configureTestingModule('browser');
      const component = TestBed.createComponent(ContactPageComponent).componentInstance;

      translateService['instant'] = vi.fn((key: string) => {
        if (key === 'contact.form.success_toast') return '✓ ¡Mensaje enviado con éxito!';
        return key;
      });

      component.showSuccessToast();

      expect(translateService['instant']).toHaveBeenCalledWith('contact.form.success_toast');
      expect(toastService.success).toHaveBeenCalledWith('✓ ¡Mensaje enviado con éxito!');
    });
  });
});
