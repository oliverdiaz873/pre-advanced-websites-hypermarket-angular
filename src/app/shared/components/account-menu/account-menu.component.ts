import { Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PlatformService } from '@core/services/platform.service';
import { IconComponent } from '../icons/icons.component';
import { AuthService } from '@features/auth/services/auth.service';

/**
 * Menú de cuenta del header. Estado «loading» (sesión en restauración) se
 * representa como skeleton para no romper la hidratación SSR. Sin JWT en la
 * UI: solo se consume el usuario expuesto por AuthService (/me).
 */
@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss',
})
export class AccountMenuComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platform = inject(PlatformService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly status = this.auth.status;
  protected readonly user = this.auth.user;
  protected readonly isOpen = signal(false);

  constructor() {
    if (this.platform.isBrowser()) {
      const closeOnOutsideClick = (event: Event): void => {
        const target = event.target as Node | null;
        if (!this.elementRef.nativeElement.contains(target)) {
          this.isOpen.set(false);
        }
      };
      document.addEventListener('click', closeOnOutsideClick);
      this.destroyRef.onDestroy(() => document.removeEventListener('click', closeOnOutsideClick));
    }
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.isOpen.set(false);
      void this.router.navigateByUrl('/');
    });
  }
}