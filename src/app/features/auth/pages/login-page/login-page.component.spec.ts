import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LoginPageComponent } from './login-page.component';

const translateServiceStub = {
  instant: vi.fn((key: string) => key),
};

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let authMock: { login: ReturnType<typeof vi.fn> };
  const navigateByUrl = vi.fn();

  beforeEach(async () => {
    authMock = { login: vi.fn() };
    navigateByUrl.mockReset();

    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: { navigateByUrl } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => '/cart' } } },
        },
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    });

    await TestBed.compileComponents();
    component = TestBed.createComponent(LoginPageComponent).componentInstance;
  });

  it('does not call login when the form is invalid', () => {
    component.submit();
    expect(authMock.login).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  it('starts with an invalid form', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('validates email format', () => {
    component.form.patchValue({ email: 'not-an-email' });
    expect(component.form.get('email')?.hasError('email')).toBe(true);
  });

  it('calls login with trimmed credentials and redirects to returnUrl on success', () => {
    authMock.login.mockReturnValue(of({ id: '1', email: 'a@b.com' }));

    component.form.setValue({ email: ' a@b.com ', password: 'secret' });
    component.submit();

    expect(authMock.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret' });
    expect(navigateByUrl).toHaveBeenCalledWith('/cart');
  });

  it('shows the translated error and stops submitting on 401', () => {
    authMock.login.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401, error: { code: 'UNAUTHORIZED' } })),
    );

    component.form.setValue({ email: 'a@b.com', password: 'wrong-pass' });
    component.submit();

    expect(component.submitError()).toBe('auth.errors.invalid_credentials');
    expect(component.isSubmitting()).toBe(false);
  });

  it('redirects to /account when there is no returnUrl', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: { navigateByUrl } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    });
    await TestBed.compileComponents();
    component = TestBed.createComponent(LoginPageComponent).componentInstance;

    authMock.login.mockReturnValue(of({ id: '1', email: 'a@b.com' }));

    component.form.setValue({ email: 'a@b.com', password: 'secret' });
    component.submit();

    expect(navigateByUrl).toHaveBeenCalledWith('/account');
  });
});