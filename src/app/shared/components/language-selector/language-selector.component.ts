import { Component, Input, inject, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../icons/icons.component';
import { SUPPORTED_LANGS } from '@core/i18n/i18n.config';

const languages = [
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'en', name: 'English', nativeName: 'English' },
];

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslatePipe, IconComponent],
  template: `
    @if (variant === 'inline') {
      <div class="lang-list-inline">
        @for (lang of languages; track lang.code) {
          <button
            type="button"
            class="lang-btn-inline"
            [class.is-active]="currentLang() === lang.code"
            (click)="changeLanguage(lang.code)"
            [attr.aria-label]="('common.switch_to_' + lang.code) | translate"
          >
            {{ lang.code | uppercase }}
          </button>
        }
      </div>
    } @else {
      <div
        class="lang-dropdown-container"
        #dropdownRef
        (mouseenter)="isDesktop() && isDropdownOpen.set(true)"
        (mouseleave)="isDesktop() && isDropdownOpen.set(false)"
      >
        <button
          type="button"
          class="lang-dropdown-trigger"
          aria-haspopup="true"
          [attr.aria-expanded]="isDropdownOpen()"
          (click)="onTriggerClick($event)"
          [attr.aria-label]="'common.select_language' | translate"
        >
          <app-icon name="world" className="w-4 h-4 shrink-0"></app-icon>
          <span class="lang-code">{{ currentLang() | uppercase }}</span>
          <app-icon name="chevron-down" className="w-3 h-3 shrink-0 chevron-icon"></app-icon>
        </button>

          <div
            class="lang-dropdown-menu"
            [class.open]="isDropdownOpen()"
            role="menu"
            aria-orientation="vertical"
            [attr.aria-hidden]="!isDropdownOpen()"
          >
            @for (lang of languages; track lang.code) {
              <button
                type="button"
                class="lang-dropdown-item"
                [class.is-active]="currentLang() === lang.code"
                (click)="changeLanguage(lang.code)"
                role="menuitem"
              >
                <span>{{ lang.nativeName }}</span>
                @if (currentLang() === lang.code) {
                  <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                }
              </button>
            }
          </div>
      </div>
    }
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; }

    .lang-list-inline {
      display: flex;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.25rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .lang-btn-inline {
      padding: 0.375rem 1rem;
      border-radius: 999px;
      font-size: 0.8125rem;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.6);
      background: transparent;
      font-family: inherit;
      line-height: inherit;
    }

    .lang-btn-inline.is-active {
      background: #f97316;
      color: #fff;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    }

    .lang-btn-inline:not(.is-active):hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .lang-dropdown-container {
      position: relative;
      display: inline-block;
    }

    .lang-dropdown-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      cursor: pointer;
      transition: background 300ms;
      font-family: inherit;
      line-height: inherit;
    }

    .lang-dropdown-trigger:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .lang-code {
      text-transform: uppercase;
    }

    .chevron-icon {
      transition: transform 300ms ease;
      opacity: 0.85;
    }

    .lang-dropdown-container:hover .chevron-icon {
      transform: rotate(180deg);
    }

    .lang-dropdown-menu {
      position: absolute;
      right: 0;
      margin-top: 0.5rem;
      width: 10rem;
      background: rgba(0, 0, 0, 0.9);
      border-radius: 0.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      z-index: 1100;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
      pointer-events: none;
    }

    .lang-dropdown-menu.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    .lang-dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      text-align: left;
      color: #fff;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: background 300ms;
      font-family: inherit;
      line-height: inherit;
    }

    .lang-dropdown-item:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .lang-dropdown-item.is-active {
      background: rgba(249, 115, 22, 0.1);
      color: #fb923c;
      font-weight: 600;
    }

    .check-icon {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  @Input() variant: 'dropdown' | 'inline' = 'dropdown';

  private translate = inject(TranslateService);
  private destroy$ = new Subject<void>();

  protected languages = languages;
  protected isDesktop = signal(false);
  protected isDropdownOpen = signal(false);
  protected currentLang = signal('es');

  private checkDesktop = () => this.isDesktop.set(window.innerWidth >= 1024);

  ngOnInit(): void {
    this.currentLang.set(this.translate.currentLang() ?? 'es');
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => this.currentLang.set(event.lang));

    this.checkDesktop();
    window.addEventListener('resize', this.checkDesktop);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkDesktop);
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  protected onTriggerClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.isDesktop()) {
      this.toggleDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  protected handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-dropdown-container')) {
      this.isDropdownOpen.set(false);
    }
  }

  protected changeLanguage(lng: string): void {
    const lang = (SUPPORTED_LANGS as readonly string[]).includes(lng) ? lng : 'es';
    this.translate.use(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', lang);
    }
    this.isDropdownOpen.set(false);
  }
}
