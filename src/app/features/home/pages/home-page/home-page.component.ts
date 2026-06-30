import { ChangeDetectionStrategy, Component } from '@angular/core';
import { products } from '@data/index';
import { offerProducts } from '@features/offers';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { CategoryBannersSectionComponent } from '../../components/category-banners-section/category-banners-section.component';
import { AboutUsComponent } from '../../components/about-us/about-us.component';

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
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  protected readonly offers = offerProducts();
  protected readonly featured = products.filter(p => FEATURED_IDS.includes(p.id));
}
