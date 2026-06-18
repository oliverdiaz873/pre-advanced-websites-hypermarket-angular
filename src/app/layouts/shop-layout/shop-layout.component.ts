import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../features/layout/components/header/header.component';
import { FooterComponent } from '../../features/layout/components/footer/footer.component';
import { TabletNavComponent } from '../../features/navigation/components/tablet-nav/tablet-nav.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'shop-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, TabletNavComponent, ToastComponent],
  template: `
    <div class="shell">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
    <app-tablet-nav></app-tablet-nav>
    <app-toast></app-toast>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .main-content {
      width: 100%;
      max-width: 72rem;
      padding: 0 1rem 4rem;
    }
  `]
})
export class ShopLayoutComponent {}
