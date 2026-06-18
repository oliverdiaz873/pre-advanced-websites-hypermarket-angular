import { Routes } from '@angular/router';
import { CatalogPageComponent } from './features/products/components/catalog-page/catalog-page.component';
import { CartPageComponent } from './features/cart/components/cart-page/cart-page.component';

export const routes: Routes = [
  { path: '', component: CatalogPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: '**', redirectTo: '' }
];
