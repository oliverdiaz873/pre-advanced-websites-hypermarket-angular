import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { authErrorKey } from '../../utils/auth-error.util';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  private readonly returnUrl: string | undefined;

  constructor() {
    const raw = this.route.snapshot.queryParamMap.get('returnUrl');
    this.returnUrl = raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : undefined;
  }

  getFieldError(controlName: 'email' | 'password'): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) {
      return this.translate.instant(`auth.login.${controlName}_required`);
    }
    if (control.errors['email']) {
      return this.translate.instant('auth.login.email_invalid');
    }
    return '';
  }

  submit(): void {
    if (this.isSubmitting()) return;

    const raw = this.form.getRawValue();
    this.form.patchValue({ email: (raw.email ?? '').trim() });
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const { email, password } = raw;

    this.auth.login({ email: email.trim(), password }).subscribe({
      next: () => {
        void this.router.navigateByUrl(this.returnUrl ?? '/account');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.submitError.set(this.translate.instant(authErrorKey(error)));
      },
    });
  }
}