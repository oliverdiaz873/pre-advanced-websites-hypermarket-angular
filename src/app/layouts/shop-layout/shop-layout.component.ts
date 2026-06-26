import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
      <main class="main-content">
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
      align-items: center;
    }

    .main-content {
      width: 100%;
      padding: 0 1rem 4rem;
    }

    @media (min-width: 768px) {
      .main-content {
        padding: 0 2rem 4rem;
      }
    }
  `]
})
export class ShopLayoutComponent {}
