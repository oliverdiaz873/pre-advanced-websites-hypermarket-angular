import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth.service';
import { accountErrorKey } from '../../utils/account-error.util';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly user = this.auth.user;
  protected readonly isLoggingOut = signal(false);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly saved = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
  });

  private prefilled = false;

  constructor() {
    // La sesión se resuelve de forma asíncrona (initialize() en el navegador),
    // por lo que el formulario se rellena una vez que el usuario está disponible.
    effect(() => {
      const u = this.auth.user();
      if (u && !this.prefilled) {
        this.prefilled = true;
        this.form.patchValue({ name: u.name, phone: u.phone ?? '' });
      }
    });
  }

  getFieldError(controlName: 'name'): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) {
      return this.translate.instant('auth.account.name_required');
    }
    if (control.errors['minlength']) {
      return this.translate.instant('auth.account.name_minlength');
    }
    return '';
  }

  save(): void {
    if (this.isSubmitting()) return;

    const raw = this.form.getRawValue();
    this.form.patchValue({ name: (raw.name ?? '').trim(), phone: (raw.phone ?? '').trim() });
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.saved.set(false);

    const { name, phone } = this.form.getRawValue();
    this.auth.updateProfile({ name, phone }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.saved.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.submitError.set(this.translate.instant(accountErrorKey(error)));
      },
    });
  }

  logout(): void {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl('/'),
      error: () => this.isLoggingOut.set(false),
    });
  }
}
