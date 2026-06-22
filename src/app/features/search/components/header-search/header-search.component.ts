import { Component, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopSearchComponent } from '../desktop-search/desktop-search.component';
import { TabletSearchComponent } from '../tablet-search/tablet-search.component';
import { MobileSearchComponent } from '../mobile-search/mobile-search.component';
import { SearchService } from '../../services/search.service';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

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
