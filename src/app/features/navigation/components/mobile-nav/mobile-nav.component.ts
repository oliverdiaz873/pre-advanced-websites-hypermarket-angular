import { Component, Input, Output, EventEmitter, signal, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';
import { LanguageSelectorComponent } from '../../../../shared/components/language-selector/language-selector.component';
import { categories } from '../../../../data/categories.data';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, IconComponent, LanguageSelectorComponent],
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) isOpen = false;
  @Output() close = new EventEmitter<void>();

  protected categories = categories;
  protected openCategory = signal<string | null>(null);
  protected openSubcategories = signal<string[]>([]);

  toggleCategory(name: string): void {
    this.openCategory.update(prev => (prev === name ? null : name));
    this.openSubcategories.set([]);
  }

  toggleSubcategory(name: string): void {
    this.openSubcategories.update(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}
