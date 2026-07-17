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
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
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
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

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
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onContainerLeave(): void {
    if (!this.isDesktop()) return;
    this.closeTimeout = setTimeout(() => {
      this.isDropdownOpen.set(false);
    }, 200);
  }

  protected cancelClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
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
