import { TestBed } from '@angular/core/testing';
import { signal, type WritableSignal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '@features/products/services/product.service';
import { AuthService } from '@features/auth/services/auth.service';
import type { AuthStatus, AuthUser } from '@features/auth/types/auth.interface';
import { MobileNavComponent } from './mobile-nav.component';

const user: AuthUser = {
  id: '1',
  name: 'Ana López',
  email: 'a@b.com',
  role: 'customer',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const translateServiceStub = {
  instant: vi.fn((key: string) => key),
  translate: vi.fn((key: string) => () => key),
  currentLang: () => 'es',
  onLangChange: of({ lang: 'es' }),
};

describe('MobileNavComponent (account links)', () => {
  let status: WritableSignal<AuthStatus>;
  let currentUser: WritableSignal<AuthUser | null>;
  let authMock: {
    status: () => AuthStatus;
    user: () => AuthUser | null;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    status = signal<AuthStatus>('anonymous');
    currentUser = signal<AuthUser | null>(null);
    authMock = { status: () => status(), user: () => currentUser(), logout: vi.fn(() => of(undefined)) };

    TestBed.configureTestingModule({
      imports: [MobileNavComponent],
      providers: [
        { provide: ProductService, useValue: { categories: signal([]) } },
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: { navigateByUrl: vi.fn(), createUrlTree: vi.fn(() => ({})), serializeUrl: vi.fn(() => '') } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } }, url: of(null) } },
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    });
  });

  const render = (): { fixture: import('@angular/core/testing').ComponentFixture<MobileNavComponent>; text: string } => {
    const fixture = TestBed.createComponent(MobileNavComponent);
    fixture.detectChanges();
    return { fixture, text: fixture.nativeElement.textContent as string };
  };

  it('shows login and register links when anonymous', () => {
    vi.useFakeTimers();
    try {
      const { text } = render();
      expect(text).toContain('header.account.login');
      expect(text).toContain('header.account.register');
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows account and logout when authenticated', () => {
    status.set('authenticated');
    currentUser.set(user);

    const { text } = render();
    expect(text).toContain('header.account.account');
    expect(text).toContain('header.account.logout');
    expect(text).toContain('A');
  });

  it('hides account links while the session is loading', () => {
    status.set('loading');

    const { text } = render();
    expect(text).not.toContain('header.account.login');
    expect(text).not.toContain('header.account.logout');
  });

  it('calls logout and closes the drawer', () => {
    status.set('authenticated');
    currentUser.set(user);

    const fixture = TestBed.createComponent(MobileNavComponent);
    fixture.detectChanges();
    const close = vi.fn();
    fixture.componentInstance.menuClosed.subscribe(close);

    fixture.componentInstance.logout();

    expect(authMock.logout).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });
});
