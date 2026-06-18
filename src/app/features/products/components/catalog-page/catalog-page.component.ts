import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { products, offersData, calculateDiscountPercentage } from '../../../../data/index';
import { ProductUI } from '../../models/product-ui.interface';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  public products: ProductUI[] = products.map(p => {
    const offer = offersData.find(o => o.id === p.id);
    if (!offer) return p;

    const discount = calculateDiscountPercentage(p.precio, offer.oldPrice);
    return {
      ...p,
      oldPrice: offer.oldPrice,
      badgeText: discount > 0 ? `-${discount}%` : undefined
    };
  });

  public onProductAction(product: ProductUI): void {
    this.cartService.addItem(product);
  }
}
