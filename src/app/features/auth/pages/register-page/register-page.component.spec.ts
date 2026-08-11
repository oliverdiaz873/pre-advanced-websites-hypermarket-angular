import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { RegisterPageComponent } from './register-page.component';

const translateServiceStub = {
  instant: vi.fn((key: string) => key),
};

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let authMock: { register: ReturnType<typeof vi.fn> };
  const navigateByUrl = vi.fn();

  beforeEach(async () => {
    authMock = { register: vi.fn() };
    navigateByUrl.mockReset();

    TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: { navigateByUrl } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } }, url: of(null) } },
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    });

    await TestBed.compileComponents();
    component = TestBed.createComponent(RegisterPageComponent).componentInstance;
  });

  it('starts with an invalid form', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('validates password minimum length', () => {
    component.form.patchValue({ password: '12345' });
    expect(component.form.get('password')?.hasError('minlength')).toBe(true);
  });

  it('validates name minimum length', () => {
    component.form.patchValue({ name: 'A' });
    expect(component.form.get('name')?.hasError('minlength')).toBe(true);
  });

  it('does not call register when the form is invalid', () => {
    component.submit();
    expect(authMock.register).not.toHaveBeenCalled();
  });

  it('calls register with trimmed values and navigates to /account on success', () => {
    authMock.register.mockReturnValue(of({ id: '1', email: 'a@b.com' }));

    component.form.setValue({ name: ' Ana ', email: ' a@b.com ', password: 'secret' });
    component.submit();

    expect(authMock.register).toHaveBeenCalledWith({ name: 'Ana', email: 'a@b.com', password: 'secret' });
    expect(navigateByUrl).toHaveBeenCalledWith('/account');
  });

  it('shows the translated error and stops submitting when the email exists', () => {
    authMock.register.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 409, error: { code: 'CONFLICT' } })),
    );

    component.form.setValue({ name: 'Ana', email: 'a@b.com', password: 'secret' });
    component.submit();

    expect(component.submitError()).toBe('auth.errors.email_exists');
    expect(component.isSubmitting()).toBe(false);
  });
});