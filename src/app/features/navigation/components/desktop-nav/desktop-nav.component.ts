import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { categories } from '../../../../data/categories.data';

@Component({
  selector: 'app-desktop-nav',
  standalone: true,
  imports: [RouterLink, TranslatePipe, IconComponent],
  templateUrl: './desktop-nav.component.html',
  styleUrls: ['./desktop-nav.component.scss']
})
/**
 * Component: DesktopNav
 * Purpose: Renders the main navigation designed for desktop devices.
 * Displays direct links and an interactive dropdown menu for categories.
 * Supports both hover and click interactions for better accessibility.
 */
export class DesktopNavComponent {
  readonly isCategoriesOpen = signal(false);
  protected categories = categories;

  toggleCategories(): void {
    this.isCategoriesOpen.update(v => !v);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleCategories();
    }
  }
}

