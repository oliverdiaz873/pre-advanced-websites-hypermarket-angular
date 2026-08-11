import { TestBed } from '@angular/core/testing';
import { signal, type WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PlatformService } from '@core/services/platform.service';
import { AuthService } from '@features/auth/services/auth.service';
import type { AuthStatus, AuthUser } from '@features/auth/types/auth.interface';
import { AccountMenuComponent } from './account-menu.component';

const user: AuthUser = {
  id: '1',
  name: 'Ana López',
  email: 'a@b.com',
  role: 'customer',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('AccountMenuComponent', () => {
  let status: WritableSignal<AuthStatus>;
  let currentUser: WritableSignal<AuthUser | null>;
  let logout: ReturnType<typeof vi.fn>;
  const navigateByUrl = vi.fn();

  beforeEach(() => {
    status = signal<AuthStatus>('loading');
    currentUser = signal<AuthUser | null>(null);
    logout = vi.fn(() => of(undefined));
    navigateByUrl.mockReset();

    TestBed.configureTestingModule({
      imports: [AccountMenuComponent],
      providers: [
        { provide: AuthService, useValue: { status: () => status(), user: () => currentUser(), logout } },
        { provide: PlatformService, useValue: { isBrowser: () => true } },
        { provide: Router, useValue: { navigateByUrl, createUrlTree: vi.fn(() => ({})), serializeUrl: vi.fn(() => '') } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } }, url: of(null) } },
        { provide: TranslateService, useValue: { instant: (key: string): string => key, translate: (key: string) => () => key } },
      ],
    });
  });

  it('renders a skeleton while the session is loading', () => {
    const fixture = TestBed.createComponent(AccountMenuComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.account-menu__skeleton')).toBeTruthy();
  });

  it('shows sign-in and sign-up links when anonymous', () => {
    status.set('anonymous');
    const fixture = TestBed.createComponent(AccountMenuComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('header.account.login');
    expect(text).toContain('header.account.register');
  });

  it('shows the account trigger with the first name when authenticated', () => {
    status.set('authenticated');
    currentUser.set(user);

    const fixture = TestBed.createComponent(AccountMenuComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Ana');
    expect(text).not.toContain('header.account.login');
  });

  it('opens the dropdown with account and logout options', () => {
    status.set('authenticated');
    currentUser.set(user);

    const fixture = TestBed.createComponent(AccountMenuComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.account-menu__dropdown')).toBeNull();

    (fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('header.account.account');
    expect(text).toContain('header.account.logout');
  });

  it('logs out and navigates home', () => {
    status.set('authenticated');
    currentUser.set(user);

    const fixture = TestBed.createComponent(AccountMenuComponent);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.account-menu__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();

    const logoutButton = Array.from(
      fixture.nativeElement.querySelectorAll('.account-menu__dropdown button') as NodeListOf<HTMLButtonElement>,
    )[0];
    logoutButton.click();
    fixture.detectChanges();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });
});