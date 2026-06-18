import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-search-results.component.html',
  styleUrl: './empty-search-results.component.scss'
})
export class EmptySearchResultsComponent {
  @Input() query = '';
}
