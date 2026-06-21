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
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
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
