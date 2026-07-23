import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DesktopNavComponent } from '../../../navigation/components/desktop-nav/desktop-nav.component';
import { MobileNavComponent } from '../../../navigation/components/mobile-nav/mobile-nav.component';
import { HeaderSearchComponent } from '../../../search/components/header-search/header-search.component';
import { LanguageSelectorComponent } from '../../../../shared/components/language-selector/language-selector.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ViewportService } from '@core/services/viewport.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink, TranslatePipe,
    DesktopNavComponent, HeaderSearchComponent,
    MobileNavComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
/**
 * Main application header component.
 *
 * Responsible for rendering:
 * - Responsive navigation (desktop / tablet / mobile)
 * - Brand identity (logo + title)
 * - Search system coordination via HeaderSearchComponent
 * - Mobile menu state management
 *
 * The component adapts its layout based on viewport mode
 * provided by ViewportService and current router state.
 */
export class HeaderComponent {
  protected isMobileMenuOpen = signal(false);
  protected isHomePage = signal(false);
  protected isSearchActive = signal(false);
  protected viewportMode = inject(ViewportService).viewportMode;

  /** Whether the brand logo should be displayed. Hidden on mobile when search is active. */
  protected showBrand = computed(
    () => this.viewportMode() !== 'mobile' || !this.isSearchActive()
  );

  /** Controls navigation visibility. Hidden when search is active or on viewports other than desktop. */
  protected showNavigation = computed(
    () => !this.isSearchActive() && this.viewportMode() === 'desktop'
  );

  /** Controls whether the language selector inside the mobile drawer should be shown. */
  protected showDrawerLanguage = computed(
    () => this.viewportMode() !== 'desktop'
  );

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.updateHomePage();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.updateHomePage());
  }

  /** Updates the homepage state based on current router URL. */
  private updateHomePage() {
    this.isHomePage.set(this.router.url === '/' || this.router.url.startsWith('/?'));
  }

  /** Toggles search active state emitted from HeaderSearchComponent. */
  protected onSearchToggle(active: boolean): void {
    this.isSearchActive.set(active);
  }
}
