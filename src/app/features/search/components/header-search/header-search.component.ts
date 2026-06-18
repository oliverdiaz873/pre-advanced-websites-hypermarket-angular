import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent {
  private router = inject(Router);

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
    }
  }

  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isExpanded.set(false);
      this.inputValue.set('');
    }
  }

  public expand(): void {
    this.isExpanded.set(true);
  }
}
