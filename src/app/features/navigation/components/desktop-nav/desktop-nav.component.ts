import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { categories } from '../../../../data/categories.data';

@Component({
  selector: 'app-desktop-nav',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  template: `
    <nav class="desktop-nav" role="navigation" [attr.aria-label]="'header.nav_aria' | translate">
      <ul class="nav-list">
        <li>
          <a routerLink="/" class="nav-link">{{ 'header.nav.home' | translate }}</a>
        </li>

        <li class="dropdown-root">
          <button
            class="nav-link dropdown-trigger"
            aria-haspopup="true"
            [attr.aria-expanded]="isCategoriesOpen()"
            (click)="toggleCategories()"
          >
            {{ 'header.nav.categories' | translate }}
            <app-icon name="chevron-down" [className]="'chevron-icon' + (isCategoriesOpen() ? ' rotate' : '')"></app-icon>
          </button>

          @if (isCategoriesOpen()) {
            <ul class="dropdown">
              @for (cat of categories; track cat.id) {
                <li class="sub-root">
                  <a [routerLink]="cat.href" class="dropdown-link">
                    <span>{{ 'categories.' + cat.id | translate }}</span>
                    <app-icon name="chevron-right" className="chevron-icon"></app-icon>
                  </a>
                  <ul class="subdropdown">
                    @for (sub of cat.subcategories; track sub.href) {
                      <li>
                        <a [routerLink]="sub.href" class="sublink">
                          {{ 'categories.sub.' + sub.href.split('#')[1] | translate }}
                        </a>
                      </li>
                    }
                  </ul>
                </li>
              }
            </ul>
          }
        </li>

        <li>
          <a routerLink="/offers" class="nav-link">{{ 'header.nav.offers' | translate }}</a>
        </li>

        <li>
          <a routerLink="/contact" class="nav-link">{{ 'header.nav.contact' | translate }}</a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .desktop-nav {
      display: none;
    }

    @media (min-width: 1024px) {
      .desktop-nav {
        display: flex;
        justify-content: center;
      }
    }

    .nav-list {
      display: flex;
      gap: 1.25rem;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-link {
      color: #fff;
      text-decoration: none;
      font-size: 1rem;
      padding: 0.5rem 0.625rem;
      display: block;
      text-align: left;
      transition: background 300ms, color 300ms;
      border-radius: 0.625rem;
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
      line-height: inherit;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .dropdown-root {
      position: relative;
    }

    .dropdown-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .chevron-icon {
      width: 0.75rem;
      height: 0.75rem;
      transition: transform 300ms ease;
      opacity: 0.85;
      flex-shrink: 0;
    }

    .chevron-icon.rotate {
      transform: rotate(180deg);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: rgba(0, 0, 0, 0.9);
      border-radius: 0.5rem;
      min-width: 220px;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      list-style: none;
      padding: 0;
      margin: 0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .dropdown-link {
      color: #fff;
      text-decoration: none;
      font-size: 1rem;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 300ms;
    }

    .dropdown-link:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .sub-root {
      position: relative;
    }

    .subdropdown {
      position: absolute;
      top: 0;
      left: 100%;
      background: rgba(0, 0, 0, 0.9);
      border-radius: 0.5rem;
      min-width: 220px;
      display: none;
      flex-direction: column;
      z-index: 1000;
      list-style: none;
      padding: 0;
      margin: 0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .sub-root:hover .subdropdown {
      display: flex;
    }

    .sublink {
      color: #fff;
      text-decoration: none;
      font-size: 1rem;
      padding: 0.375rem 1rem;
      display: block;
      transition: background 300ms;
    }

    .sublink:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `]
})
export class DesktopNavComponent {
  readonly isCategoriesOpen = signal(false);
  protected categories = categories;

  toggleCategories(): void {
    this.isCategoriesOpen.update(v => !v);
  }
}

