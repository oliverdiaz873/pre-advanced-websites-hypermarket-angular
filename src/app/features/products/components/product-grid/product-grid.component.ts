import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent {
  @Input() products: ProductUI[] = [];
  @Input() actionText?: string;

  @Output() productAction = new EventEmitter<ProductUI>();

  onProductAction(product: ProductUI): void {
    this.productAction.emit(product);
  }
}
