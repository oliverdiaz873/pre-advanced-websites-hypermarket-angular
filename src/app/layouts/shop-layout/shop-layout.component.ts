import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { HeaderComponent } from '../../features/layout/components/header/header.component';
import { FooterComponent } from '../../features/layout/components/footer/footer.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ScrollToTopComponent } from '../../shared/components/scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'shop-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, ScrollToTopComponent],
  template: `
    <div class="shell">
      <app-header></app-header>
      <div class="h-[60px] xl:h-[85px]"></div>
      <main class="main-content" [class.is-home]="isHome()">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
    <app-toast></app-toast>
    <app-scroll-to-top></app-scroll-to-top>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      background: var(--page-bg, #f9fafb);
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      margin-inline: auto;
      padding-bottom: 1rem;
    }

    .main-content:not(.is-home) {
      max-width: var(--layout-max-width);
    }

    @media (min-width: 768px) {
      .main-content {
        padding-bottom: 2rem;
      }
    }
  `]
})
export class ShopLayoutComponent {
  private readonly router = inject(Router);

  readonly isHome = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects === '/' || e.url === '/'),
      startWith(this.router.url === '/')
    ),
    { initialValue: false }
  );
}
