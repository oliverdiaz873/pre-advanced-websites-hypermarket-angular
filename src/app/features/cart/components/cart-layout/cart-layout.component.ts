import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CartLayout - Cart Layout Component
 *
 * Provides the visual container structure for the cart
 * with consistent styles, responsive spacing, and layout.
 * It is reusable and maintains visual consistency.
 */
@Component({
  selector: 'app-cart-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-layout.component.html',
  styleUrl: './cart-layout.component.scss'
})
export class CartLayoutComponent {
  @Input() class = '';
}
