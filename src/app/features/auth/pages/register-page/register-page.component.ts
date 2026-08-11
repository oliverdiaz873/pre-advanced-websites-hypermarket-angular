import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { authErrorKey } from '../../utils/auth-error.util';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  getFieldError(controlName: 'name' | 'email' | 'password'): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) {
      return this.translate.instant(`auth.register.${controlName}_required`);
    }
    if (control.errors['email']) {
      return this.translate.instant('auth.register.email_invalid');
    }
    if (control.errors['minlength']) {
      return this.translate.instant(`auth.register.${controlName}_minlength`);
    }
    return '';
  }

  submit(): void {
    if (this.isSubmitting()) return;

    const raw = this.form.getRawValue();
    this.form.patchValue({ name: (raw.name ?? '').trim(), email: (raw.email ?? '').trim() });
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const { name, email, password } = raw;

    this.auth.register({ name: name.trim(), email: email.trim(), password }).subscribe({
      next: () => {
        void this.router.navigateByUrl('/account');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.submitError.set(this.translate.instant(authErrorKey(error)));
      },
    });
  }
}