import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-empty-search-results',
  standalone: true,
  imports: [TranslatePipe, EmptyStateComponent],
  templateUrl: './empty-search-results.component.html',
  styleUrl: './empty-search-results.component.scss'
})
export class EmptySearchResultsComponent {
  @Input() query = '';

  get titleKey(): string {
    return this.query
      ? 'search.empty_state.no_results.title'
      : 'search.empty_state.start_search.title';
  }

  get descriptionKey(): string {
    return this.query
      ? 'search.empty_state.no_results.desc'
      : 'search.empty_state.start_search.desc';
  }
}
