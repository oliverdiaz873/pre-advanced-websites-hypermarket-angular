import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { IconComponent } from '@shared/components/icons/icons.component';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  imports: [TranslatePipe, EmptyStateComponent, IconComponent],
  templateUrl: './empty-cart.component.html',
  styleUrl: './empty-cart.component.scss'
})
/**
 * EmptyCartComponent — Empty cart state
 *
 * Reuses EmptyStateComponent to display an informational
 * message when the cart has no products.
 */
export class EmptyCartComponent {}
