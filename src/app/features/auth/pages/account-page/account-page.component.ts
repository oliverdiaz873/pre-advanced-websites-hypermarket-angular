import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly isLoggingOut = signal(false);

  logout(): void {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl('/'),
      error: () => this.isLoggingOut.set(false),
    });
  }
}