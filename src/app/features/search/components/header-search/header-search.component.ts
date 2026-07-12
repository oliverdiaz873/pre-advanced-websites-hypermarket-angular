import { Component, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopSearchComponent } from '../desktop-search/desktop-search.component';
import { TabletSearchComponent } from '../tablet-search/tablet-search.component';
import { MobileSearchComponent } from '../mobile-search/mobile-search.component';
import { SearchService } from '../../services/search.service';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

/**
 * Header search dispatcher component.
 *
 * This component adapts the search architecture from the Next.js implementation
 * by separating viewport-based rendering from the header container.
 *
 * In the Next.js version, Header.tsx directly renders DesktopSearch, TabletSearch,
 * or MobileSearch and manages the useHeaderSearch hook. In Angular, the shared
 * search state and actions are handled by SearchService, while this component
 * is responsible only for selecting the correct search variant based on the
 * current viewport mode.
 *
 * This keeps HeaderComponent decoupled from search-specific rendering logic.
 */
@Component({
  selector: 'app-header-search',
  standalone: true,
  imports: [CommonModule, DesktopSearchComponent, TabletSearchComponent, MobileSearchComponent],
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent {
  viewportMode = input.required<ViewportMode>();
  searchToggle = output<boolean>();
  private searchService = inject(SearchService);

  constructor() {
    effect(() => {
      this.searchToggle.emit(this.searchService.isSearchActive());
    });
  }
}
