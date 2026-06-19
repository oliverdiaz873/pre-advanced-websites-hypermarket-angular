import { Component, inject, signal, DestroyRef } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { DesktopNavComponent } from '../../../navigation/components/desktop-nav/desktop-nav.component';
import { MobileNavComponent } from '../../../navigation/components/mobile-nav/mobile-nav.component';
import { TabletNavComponent } from '../../../navigation/components/tablet-nav/tablet-nav.component';
import { TabletMenuService } from '../../../navigation/services/tablet-menu.service';
import { CartService } from '../../../../core/services/cart.service';
import { HeaderSearchComponent } from '../../../search/components/header-search/header-search.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent, DesktopNavComponent, HeaderSearchComponent, MobileNavComponent, TabletNavComponent],
  template: `
    <header class="app-header">
      <div class="header-inner">
        <button class="menu-btn" (click)="isMobileMenuOpen.set(!isMobileMenuOpen())" [attr.aria-label]="(isMobileMenuOpen() ? 'header.menu_close' : 'header.menu_open') | translate">
          <span class="hamburger-line" [class.open]="isMobileMenuOpen()"></span>
          <span class="hamburger-line" [class.open]="isMobileMenuOpen()"></span>
          <span class="hamburger-line" [class.open]="isMobileMenuOpen()"></span>
        </button>

        <button class="tablet-menu-btn" (click)="tabletMenuService.toggle()" [attr.aria-label]="'header.menu_open' | translate">
          <app-icon name="menu" className="w-6 h-6"></app-icon>
        </button>

        <a routerLink="/" class="brand">
          <img src="/assets/images/logo/logo.png" alt="Logo" class="brand-logo" width="36" height="36" />
          @if (isHomePage()) {
            <h1 class="brand-title">{{ 'header.brand' | translate }}</h1>
          } @else {
            <span class="brand-title">{{ 'header.brand' | translate }}</span>
          }
        </a>

        <app-desktop-nav></app-desktop-nav>

        <app-header-search></app-header-search>

        <a routerLink="/cart" class="cart-btn">
          <div class="cart-icon-wrap">
            <app-icon name="cart" className="w-5 h-5 text-white"></app-icon>
            @if (cartService.totalItems() > 0) {
              <span class="cart-badge">{{ cartService.totalItems() }}</span>
            }
          </div>
          <span class="cart-label">{{ 'header.cart_label' | translate }}</span>
        </a>
      </div>
    </header>

    <div class="mobile-nav-wrapper">
      <app-mobile-nav
        [isOpen]="isMobileMenuOpen()"
        (close)="isMobileMenuOpen.set(false)"
      ></app-mobile-nav>
    </div>
    <app-tablet-nav></app-tablet-nav>
  `,
  styles: [`
    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.8);
      padding: 0.375rem 0.625rem;
      z-index: 1000;
      display: flex;
      justify-content: center;
      color: #fff;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    @media (min-width: 1280px) {
      .app-header {
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 15px;
        width: max-content;
        max-width: calc(100vw - 40px);
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
      }
    }

    .header-inner {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      justify-content: space-between;
      width: 100%;
      padding: 0;
    }

    @media (min-width: 768px) {
      .header-inner {
        justify-content: center;
        gap: 0.375rem;
        padding: 0 0.375rem;
      }
    }

    @media (min-width: 1024px) {
      .header-inner {
        gap: 0.625rem;
        padding: 0 0.875rem;
      }
    }

    .menu-btn {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.375rem;
      width: 2.5rem;
      height: 2.5rem;
      background: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      transition: background 300ms;
      border-radius: 0.25rem;
      padding: 0.5rem;
      position: relative;
      z-index: 1000;
    }

    .menu-btn:hover { background: rgba(255,255,255,0.15); }

    .hamburger-line {
      display: block;
      width: 1.5rem;
      height: 0.125rem;
      background: #fff;
      transition: all 300ms ease-in-out;
    }

    .hamburger-line.open:nth-child(1) {
      transform: rotate(45deg) translateY(0.5rem);
    }

    .hamburger-line.open:nth-child(2) {
      opacity: 0;
    }

    .hamburger-line.open:nth-child(3) {
      transform: rotate(-45deg) translateY(-0.5rem);
    }

    .tablet-menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      border: none;
      background: transparent;
      color: #fff;
      cursor: pointer;
      transition: background 200ms;
    }

    .tablet-menu-btn:hover { background: rgba(255,255,255,0.15); }

    @media (min-width: 768px) {
      .menu-btn { display: none; }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
      .tablet-menu-btn { display: inline-flex; }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #fff;
      text-decoration: none;
      transition: opacity 200ms;
    }

    .brand:hover { opacity: 0.9; }

    @media (min-width: 768px) {
      .brand { margin-right: 1rem; }
    }

    .brand-logo {
      width: 2.25rem;
      height: 2.25rem;
      object-fit: contain;
    }

    .brand-title {
      font-size: 1rem;
      font-weight: 700;
      white-space: nowrap;
      margin: 0;
    }

    .cart-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      border: 1px solid rgba(255,255,255,0.2);
      background: transparent;
      color: #fff;
      font-weight: 700;
      font-size: 0.875rem;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: background 200ms, border-color 200ms;
      cursor: pointer;
      user-select: none;
    }

    .cart-btn:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.3);
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
      box-shadow: 0 0 0 2px rgba(0,0,0,0.8);
    }

    .cart-label { display: none; }

    @media (min-width: 640px) {
      .cart-label { display: inline; }
    }

    .mobile-nav-wrapper { display: block; }

    @media (min-width: 768px) {
      .mobile-nav-wrapper { display: none; }
    }
  `]
})
export class HeaderComponent {
  protected isMobileMenuOpen = signal(false);
  protected cartService = inject(CartService);
  protected tabletMenuService = inject(TabletMenuService);
  protected isHomePage = signal(false);

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.updateHomePage();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.updateHomePage());
  }

  private updateHomePage() {
    this.isHomePage.set(this.router.url === '/' || this.router.url.startsWith('/?'));
  }
}
