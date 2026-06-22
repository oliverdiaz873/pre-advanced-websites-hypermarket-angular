import { Component, inject, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { IconComponent } from '../../../../shared/components/icons/icons.component';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

@Component({
  selector: 'app-header-search',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent {
  viewportMode = input.required<ViewportMode>();
  searchToggle = output<boolean>();

  private router = inject(Router);
  protected cartService = inject(CartService);

  public inputValue = signal('');
  public isExpanded = signal(false);

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    const q = this.inputValue().trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
      this.isExpanded.set(false);
      this.searchToggle.emit(false);
    }
  }

  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isExpanded.set(false);
      this.inputValue.set('');
      this.searchToggle.emit(false);
    }
  }

  public expand(): void {
    this.isExpanded.set(true);
    this.searchToggle.emit(true);
  }
}
