import { Component } from '@angular/core';
import { ProductGridComponent } from './features/products/components/product-grid/product-grid.component';
import { products } from '@data/index';
import { offersData, calculateDiscountPercentage } from '@data/index';
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
  products: ProductUI[] = products.map(p => {
    const offer = offersData.find(o => o.id === p.id);
    if (!offer) return p;

    const discount = calculateDiscountPercentage(p.precio, offer.oldPrice);
    return {
      ...p,
      oldPrice: offer.oldPrice,
      badgeText: discount > 0 ? `-${discount}%` : undefined
    };
  });

  onProductAction(product: ProductUI): void {
    alert(`Producto clickeado: ${product.nombre} (Precio: $${product.precio})`);
  }
}
