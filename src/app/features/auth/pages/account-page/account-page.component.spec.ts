import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { AccountPageComponent } from './account-page.component';
import type { AuthUser } from '../../types/auth.interface';

const user: AuthUser = {
  id: '1',
  name: 'Ana López',
  email: 'a@b.com',
  role: 'customer',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('AccountPageComponent', () => {
  let component: AccountPageComponent;
  let fixture: ComponentFixture<AccountPageComponent>;
  let authMock: { logout: ReturnType<typeof vi.fn>; updateProfile: ReturnType<typeof vi.fn> };
  const navigateByUrl = vi.fn();

  beforeEach(async () => {
    authMock = { logout: vi.fn(), updateProfile: vi.fn() };
    navigateByUrl.mockReset();

    TestBed.configureTestingModule({
      imports: [AccountPageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: { user: () => user, logout: authMock.logout, updateProfile: authMock.updateProfile },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl,
            createUrlTree: vi.fn(() => ({})),
            serializeUrl: vi.fn(() => ''),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } }, url: of(null) },
        },
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string): string => key,
            translate: (key: string) => () => key,
          },
        },
      ],
    });

    await TestBed.compileComponents();
    fixture = TestBed.createComponent(AccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the current user details', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('a@b.com');
    const nameInput = fixture.nativeElement.querySelector('#account-name') as HTMLInputElement;
    expect(nameInput.value).toBe('Ana López');
  });

  it('prefills the form with the current user name and phone', () => {
    expect(component.form.getRawValue()).toEqual({ name: 'Ana López', phone: '' });
  });

  it('saves name and phone via updateProfile and marks as saved', () => {
    authMock.updateProfile.mockReturnValue(of({ ...user, name: 'Ana María', phone: '123' }));

    component.form.setValue({ name: 'Ana María', phone: '123' });
    component.save();

    expect(authMock.updateProfile).toHaveBeenCalledWith({ name: 'Ana María', phone: '123' });
    expect(component.isSubmitting()).toBe(false);
    expect(component.saved()).toBe(true);
    expect(component.submitError()).toBeNull();
  });

  it('does not call updateProfile when the form is invalid', () => {
    component.form.setValue({ name: '', phone: '' });
    component.save();

    expect(authMock.updateProfile).not.toHaveBeenCalled();
  });

  it('shows an error message when the update fails', () => {
    authMock.updateProfile.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: 'VALIDATION_ERROR' } })),
    );

    component.form.setValue({ name: 'Ana', phone: '' });
    component.save();

    expect(component.isSubmitting()).toBe(false);
    expect(component.submitError()).toBe('auth.errors.update_failed');
    expect(component.saved()).toBe(false);
  });

  it('calls logout and navigates back home on success', () => {
    authMock.logout.mockReturnValue(of(undefined));

    component.logout();

    expect(authMock.logout).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('ignores repeated clicks while logging out', () => {
    authMock.logout.mockReturnValue(of(undefined));

    component.logout();
    component.logout();

    expect(authMock.logout).toHaveBeenCalledTimes(1);
  });
});
