import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { DrawerComponent } from '../../../../shared/components/drawer/drawer.component';
import { TabletMenuService } from '../../services/tablet-menu.service';
import { categories } from '../../../../data/categories.data';

@Component({
  selector: 'app-tablet-nav',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent, DrawerComponent],
  template: `
    <app-drawer [isOpen]="menuService.isOpen()" (closeDrawer)="menuService.close()">
      <nav class="tablet-nav-content" role="navigation" [attr.aria-label]="'header.nav_aria' | translate">
        <ul class="nav-list">
          <li>
            <a routerLink="/" class="nav-link" (click)="menuService.close()">
              {{ 'header.nav.home' | translate }}
            </a>
          </li>

          <li>
            <button class="nav-link dropdown-toggle" (click)="toggleCategorySection()">
              <span>{{ 'header.nav.categories' | translate }}</span>
              <app-icon name="chevron-down" [className]="'chevron-icon' + (isCategorySectionOpen() ? ' rotate' : '')"></app-icon>
            </button>

            @if (isCategorySectionOpen()) {
              <ul class="sub-list">
                @for (cat of categories; track cat.id) {
                  <li>
                    <a [routerLink]="cat.href" class="sub-link" (click)="menuService.close()">
                      <span>{{ 'categories.' + cat.id | translate }}</span>
                      @if (cat.subcategories.length) {
                        <app-icon name="chevron-right" class="chevron-icon"></app-icon>
                      }
                    </a>
                    @if (cat.subcategories.length) {
                      <ul class="sub-list sub-list-nested">
                        @for (sub of cat.subcategories; track sub.href) {
                          <li>
                            <a [routerLink]="sub.href" class="sub-link sub-link-nested" (click)="menuService.close()">
                              {{ 'categories.sub.' + sub.href.split('#')[1] | translate }}
                            </a>
                          </li>
                        }
                      </ul>
                    }
                  </li>
                }
              </ul>
            }
          </li>

          <li>
            <a routerLink="/offers" class="nav-link" (click)="menuService.close()">
              {{ 'header.nav.offers' | translate }}
            </a>
          </li>

          <li>
            <a routerLink="/contact" class="nav-link" (click)="menuService.close()">
              {{ 'header.nav.contact' | translate }}
            </a>
          </li>
        </ul>
      </nav>
    </app-drawer>
  `,
  styles: [`
    .tablet-nav-content {
      padding: 4rem 1rem 1rem;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: background 200ms;
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
      line-height: inherit;
      text-align: left;
    }

    .nav-link:hover {
      background: #f3f4f6;
    }

    .dropdown-toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      text-align: left;
    }

    .chevron-icon {
      width: 1rem;
      height: 1rem;
      transition: transform 300ms ease;
      color: #6b7280;
    }

    .chevron-icon.rotate {
      transform: rotate(180deg);
    }

    .sub-list {
      list-style: none;
      padding: 0;
      margin: 0 0 0 1rem;
      display: flex;
      flex-direction: column;
    }

    .sub-list-nested {
      margin-left: 1rem;
    }

    .sub-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      color: #374151;
      text-decoration: none;
      border-radius: 0.375rem;
      transition: background 200ms;
    }

    .sub-link:hover {
      background: #f3f4f6;
    }

    .sub-link-nested {
      font-size: 0.85rem;
      color: #6b7280;
    }
  `]
})
export class TabletNavComponent {
  protected menuService = inject(TabletMenuService);
  protected categories = categories;
  readonly isCategorySectionOpen = signal(false);

  toggleCategorySection(): void {
    this.isCategorySectionOpen.update(v => !v);
  }
}
