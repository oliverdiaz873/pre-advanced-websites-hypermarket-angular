import { Routes } from '@angular/router';
import { CatalogPageComponent } from './features/products/components/catalog-page/catalog-page.component';
import { CartPageComponent } from './features/cart/components/cart-page/cart-page.component';
import { SearchPageComponent } from './features/search/components/search-page/search-page.component';

export const routes: Routes = [
  { path: '', component: CatalogPageComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '**', redirectTo: '' }
];
