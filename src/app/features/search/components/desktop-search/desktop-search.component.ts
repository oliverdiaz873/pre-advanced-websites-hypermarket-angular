import { Component, inject, ViewChild, ElementRef, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchService } from '../../services/search.service';
import { CartService } from '@features/cart/services/cart.service';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { getAssetUrl } from '../../../../core/utils';

@Component({
  selector: 'app-desktop-search',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, IconComponent],
  templateUrl: './desktop-search.component.html',
  styleUrl: './desktop-search.component.scss'
})
export class DesktopSearchComponent {
  protected searchService = inject(SearchService);
  protected cartService = inject(CartService);
  protected getAssetUrl = getAssetUrl;

  @ViewChild('searchInput', { read: ElementRef })
  searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('resultsList', { read: ElementRef })
  resultsList!: ElementRef<HTMLUListElement>;

  constructor() {
    effect(() => {
      if (this.searchService.isSearchActive()) {
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 100);
      }
    });
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (
      this.resultsList &&
      !this.resultsList.nativeElement.contains(event.target as Node)
    ) {
      this.searchService.setSearchTerm('');
    }
  }

  handleInput(event: Event): void {
    this.searchService.setSearchTerm((event.target as HTMLInputElement).value);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchService.submitSearch();
    }
  }

  handleResultClick(id: string): void {
    this.searchService.selectResult(id);
  }

  handleToggleClick(): void {
    if (this.searchService.isSearchActive()) {
      this.searchService.submitSearch();
    } else {
      this.searchService.toggleSearch();
    }
  }
}
