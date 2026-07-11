import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

/**
 * ProductGrid - Reusable grid layout for displaying products.
 * Used in pages like Search, Offers, Category, and Catalog
 * to maintain visual consistency across product listings.
 */
@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent {
  @Input() products: ProductUI[] = [];
  @Input() className: string = '';
}
