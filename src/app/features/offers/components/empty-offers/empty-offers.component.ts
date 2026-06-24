import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-empty-offers',
  standalone: true,
  imports: [TranslatePipe, EmptyStateComponent],
  templateUrl: './empty-offers.component.html',
  styleUrl: './empty-offers.component.scss'
})
export class EmptyOffersComponent {}
