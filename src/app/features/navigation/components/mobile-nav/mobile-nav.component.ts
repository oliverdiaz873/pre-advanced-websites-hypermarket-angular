import { Component, Input, Output, EventEmitter, signal, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { LanguageSelectorComponent } from '../../../../shared/components/language-selector/language-selector.component';
import { categories } from '../../../../data/categories.data';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, IconComponent, LanguageSelectorComponent],
  template: `
    <!-- Dark overlay backdrop -->
    <div
      class="mobile-backdrop"
      [class.is-open]="isOpen"
      (click)="close.emit()"
    ></div>

    <!-- Mobile Menu Panel -->
    <nav
      class="mobile-panel"
      [class.is-open]="isOpen"
      [attr.aria-label]="'header.nav_aria' | translate"
    >
      <ul class="mobile-nav-list">
        <li class="mobile-nav-item">
          <a routerLink="/" class="mobile-nav-link" (click)="close.emit()">
            {{ 'header.nav.home' | translate }}
          </a>
        </li>

        <li class="mobile-nav-item">
          <button
            class="mobile-nav-link mobile-nav-toggle"
            (click)="toggleCategorySection()"
          >
            <span>{{ 'header.nav.categories' | translate }}</span>
            <app-icon
              name="chevron-down"
              [className]="'mobile-chevron' + (isCategoryOpen() ? ' rotate' : '')"
            ></app-icon>
          </button>

          @if (isCategoryOpen()) {
            <div class="mobile-submenu">
              <ul class="mobile-submenu-list">
                @for (cat of categories; track cat.id) {
                  <li>
                    <button
                      class="mobile-submenu-toggle"
                      (click)="toggleCategory(cat.id)"
                    >
                      <span>{{ 'categories.' + cat.id | translate }}</span>
                      <app-icon
                        name="chevron-right"
                        [className]="'mobile-chevron-right' + (openSubcategories().includes(cat.id) ? ' rotate' : '')"
                      ></app-icon>
                    </button>

                    @if (openSubcategories().includes(cat.id)) {
                      <ul class="mobile-submenu-nested">
                        @for (sub of cat.subcategories; track sub.href) {
                          <li>
                            <a
                              [routerLink]="sub.href"
                              class="mobile-submenu-link"
                              (click)="close.emit()"
                            >
                              {{ 'categories.sub.' + sub.href.split('#')[1] | translate }}
                            </a>
                          </li>
                        }
                      </ul>
                    }
                  </li>
                }
              </ul>
            </div>
          }
        </li>

        <li class="mobile-nav-item">
          <a routerLink="/offers" class="mobile-nav-link" (click)="close.emit()">
            {{ 'header.nav.offers' | translate }}
          </a>
        </li>

        <li class="mobile-nav-item">
          <a routerLink="/contact" class="mobile-nav-link" (click)="close.emit()">
            {{ 'header.nav.contact' | translate }}
          </a>
        </li>

        <li class="mobile-nav-item mobile-nav-lang">
          <div class="mobile-lang-wrapper">
            <app-icon name="world" className="w-5 h-5 shrink-0 opacity-70"></app-icon>
            <span class="mobile-lang-label">{{ 'header.language' | translate }}</span>
          </div>
          <app-language-selector variant="inline"></app-language-selector>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 998;
      opacity: 0;
      pointer-events: none;
      transition: opacity 300ms ease;
    }
    .mobile-backdrop.is-open {
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-panel {
      position: fixed;
      top: 0;
      left: 0;
      width: 280px;
      max-width: 85vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      color: #fff;
      z-index: 999;
      overflow-y: auto;
      padding: 1.25rem 0;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      transform: translateX(-100%);
      opacity: 0;
      transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    }
    .mobile-panel.is-open {
      transform: translateX(0);
      opacity: 1;
    }
    .mobile-panel::-webkit-scrollbar { width: 6px; }
    .mobile-panel::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; }

    .mobile-nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .mobile-nav-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.625rem 1.25rem;
    }

    .mobile-nav-link {
      display: block;
      padding: 0.25rem 0;
      color: #fff;
      text-decoration: none;
      transition: color 200ms;
      font-size: 1rem;
    }
    .mobile-nav-link:hover { color: #f97316; }

    .mobile-nav-toggle {
      width: 100%;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      font-family: inherit;
      font-size: 1rem;
      line-height: inherit;
      padding: 0.25rem 0;
      transition: color 200ms;
    }
    .mobile-nav-toggle:hover { color: #f97316; }

    .mobile-chevron {
      width: 0.75rem;
      height: 0.75rem;
      transition: transform 300ms ease;
      opacity: 0.7;
      flex-shrink: 0;
    }
    .mobile-chevron.rotate { transform: rotate(180deg); }

    .mobile-submenu {
      overflow: hidden;
      margin-top: 0.5rem;
    }

    .mobile-submenu-list {
      list-style: none;
      padding: 0 0 0 1rem;
      margin: 0;
    }

    .mobile-submenu-toggle {
      width: 100%;
      text-align: left;
      padding: 0.625rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      font-size: 0.875rem;
      font-family: inherit;
      line-height: inherit;
      transition: color 200ms;
    }
    .mobile-submenu-toggle:hover { color: #fb923c; }

    .mobile-chevron-right {
      width: 0.75rem;
      height: 0.75rem;
      transition: transform 300ms ease;
      opacity: 0.5;
      flex-shrink: 0;
    }
    .mobile-chevron-right.rotate { transform: rotate(90deg); }

    .mobile-submenu-nested {
      list-style: none;
      padding: 0 0 0 1rem;
      margin: 0;
    }

    .mobile-submenu-link {
      display: block;
      padding: 0.375rem 0;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.8125rem;
      transition: color 200ms;
    }
    .mobile-submenu-link:hover { color: #fb923c; }

    .mobile-nav-lang {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
    }

    .mobile-lang-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mobile-lang-label {
      font-size: 1rem;
      color: #fff;
    }
  `]
})
export class MobileNavComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) isOpen = false;
  @Output() close = new EventEmitter<void>();

  protected categories = categories;
  protected isCategoryOpen = signal(false);
  protected openSubcategories = signal<string[]>([]);

  toggleCategorySection(): void {
    this.isCategoryOpen.update(v => !v);
    this.openSubcategories.set([]);
  }

  toggleCategory(id: string): void {
    this.openSubcategories.update(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}
