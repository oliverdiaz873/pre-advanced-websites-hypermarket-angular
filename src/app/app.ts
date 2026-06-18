import { Component } from '@angular/core';
import { ShopLayoutComponent } from './layouts/shop-layout/shop-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShopLayoutComponent],
  template: '<shop-layout></shop-layout>',
  styleUrl: './app.scss'
})
export class App {}
