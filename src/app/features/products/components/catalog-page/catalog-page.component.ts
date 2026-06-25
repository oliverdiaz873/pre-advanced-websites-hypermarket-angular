import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { products } from '../../../../data/index';
import { offersData, calculateDiscountPercentage } from '@features/offers';
import { ProductUI } from '../../models/product-ui.interface';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent {
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
}
