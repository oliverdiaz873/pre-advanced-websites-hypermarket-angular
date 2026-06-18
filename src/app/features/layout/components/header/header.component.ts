import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { DesktopNavComponent } from '../../../navigation/components/desktop-nav/desktop-nav.component';
import { TabletMenuService } from '../../../navigation/services/tablet-menu.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent, DesktopNavComponent],
  template: `
    <header class="app-header">
      <div class="header-inner">
        <button class="menu-btn" (click)="tabletMenuService.toggle()" [attr.aria-label]="'header.menu_open' | translate">
          <app-icon name="menu" className="w-6 h-6"></app-icon>
        </button>

        <a routerLink="/" class="brand">
          <h1 class="brand-title">
            <app-icon name="cart" className="w-7 h-7 text-green-600"></app-icon>
            {{ 'header.brand' | translate }}
          </h1>
        </a>

        <app-desktop-nav></app-desktop-nav>

        <a routerLink="/cart" class="cart-btn">
          <div class="cart-icon-wrap">
            <app-icon name="cart" className="w-5 h-5 text-gray-700"></app-icon>
            @if (cartService.totalItems() > 0) {
              <span class="cart-badge">{{ cartService.totalItems() }}</span>
            }
          </div>
          <span class="cart-label">{{ 'header.cart_label' | translate }}</span>
        </a>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      width: 100%;
      max-width: 72rem;
      margin: 0 auto;
      padding: 2rem 1rem 0;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    @media (min-width: 640px) {
      .header-inner {
        flex-wrap: nowrap;
      }
    }

    .menu-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      border: none;
      background: transparent;
      color: #374151;
      cursor: pointer;
      transition: background 200ms;
    }

    .menu-btn:hover {
      background: #f3f4f6;
    }

    @media (min-width: 768px) {
      .menu-btn {
        display: none;
      }
    }

    .brand {
      text-decoration: none;
      color: inherit;
      transition: opacity 200ms;
    }

    .brand:hover {
      opacity: 0.9;
    }

    .brand-title {
      font-size: 1.875rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }

    .cart-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      background: #fff;
      color: #1f2937;
      font-weight: 700;
      font-size: 0.875rem;
      text-decoration: none;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: background 200ms, border-color 200ms;
      cursor: pointer;
      user-select: none;
    }

    .cart-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .cart-btn:active {
      background: #f3f4f6;
    }

    .cart-icon-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cart-badge {
      position: absolute;
      top: -0.875rem;
      right: -0.875rem;
      display: flex;
      height: 1.25rem;
      width: 1.25rem;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background: #ef4444;
      font-size: 0.625rem;
      font-weight: 900;
      color: #fff;
      ring: 2px solid #fff;
      box-shadow: 0 0 0 2px #fff;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .cart-label {
      display: none;
    }

    @media (min-width: 640px) {
      .cart-label {
        display: inline;
      }
    }
  `]
})
export class HeaderComponent {
  protected tabletMenuService = inject(TabletMenuService);
  protected cartService = inject(CartService);
}
