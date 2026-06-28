import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DesktopNavComponent } from '../../../navigation/components/desktop-nav/desktop-nav.component';
import { MobileNavComponent } from '../../../navigation/components/mobile-nav/mobile-nav.component';
import { TabletNavComponent } from '../../../navigation/components/tablet-nav/tablet-nav.component';
import { CartService } from '@features/cart/services/cart.service';
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
    MobileNavComponent, TabletNavComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected isMobileMenuOpen = signal(false);
  protected cartService = inject(CartService);
  protected isHomePage = signal(false);
  protected isSearchActive = signal(false);
  protected viewportMode = inject(ViewportService).viewportMode;

  protected showBrand = computed(
    () => this.viewportMode() !== 'mobile' || !this.isSearchActive()
  );

  protected showNavigation = computed(
    () => !this.isSearchActive() && this.viewportMode() !== 'mobile'
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

  private updateHomePage() {
    this.isHomePage.set(this.router.url === '/' || this.router.url.startsWith('/?'));
  }

  protected onSearchToggle(active: boolean): void {
    this.isSearchActive.set(active);
  }
}
