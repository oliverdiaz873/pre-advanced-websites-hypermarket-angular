import { Component } from '@angular/core';
import { ProductGridComponent } from './features/products/components/product-grid/product-grid.component';
import { MOCK_PRODUCTS } from './features/products/mocks/product.mock';
import { ProductUI } from './features/products/models/product-ui.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductGridComponent, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  products = MOCK_PRODUCTS;

  onProductAction(product: ProductUI): void {
    alert(`Producto clickeado: ${product.nombre} (Precio: $${product.precio})`);
  }
}
