import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { IconComponent } from '@shared/components/icons/icons.component';

@Component({
  selector: 'app-empty-search-results',
  standalone: true,
  imports: [TranslatePipe, EmptyStateComponent, IconComponent],
  templateUrl: './empty-search-results.component.html',
  styleUrl: './empty-search-results.component.scss',
  encapsulation: ViewEncapsulation.None
})
/**
 * EmptySearchResultsComponent - Componente para estados vacíos en la página de búsqueda
 *
 * Se muestra cuando una búsqueda no tiene resultados o cuando la página
 * se carga sin una consulta inicial.
 */
export class EmptySearchResultsComponent {
  /** La consulta de búsqueda que no arrojó resultados */
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
