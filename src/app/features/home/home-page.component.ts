import { ChangeDetectionStrategy, Component } from '@angular/core';
import { offerProducts, products } from '@data/index';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { CategoryBannersSectionComponent } from './components/category-banners-section/category-banners-section.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

const FEATURED_IDS = [
  'televisor_samsung_75_pulgadas',
  'nevera_lg',
  'ventilador_daiwa',
  'sofa_cama_blanco',
  'carne_de_res_para_hamburguesas',
  'pollo_entero_don_pollo',
  'atun_dimar',
];

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ProductCarouselSectionComponent, HeroCarouselComponent, CategoryBannersSectionComponent, AboutUsComponent],
  template: `
    <app-hero-carousel></app-hero-carousel>

    <app-product-carousel-section title="Ofertas destacadas" [products]="offers"></app-product-carousel-section>

    <app-product-carousel-section title="Productos destacados" [products]="featured" class="mt-6 md:mt-8"></app-product-carousel-section>

    <app-category-banners-section></app-category-banners-section>

    <app-about-us></app-about-us>
  `,
  styles: [`
    :host { display: grid; gap: 2rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  protected readonly offers = offerProducts();
  protected readonly featured = products.filter(p => FEATURED_IDS.includes(p.id));
}
