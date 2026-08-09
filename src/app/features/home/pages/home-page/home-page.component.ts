import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { offerProducts } from '@features/offers';
import { ProductService } from '@features/products/services/product.service';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { CategoryBannersSectionComponent } from '../../components/category-banners-section/category-banners-section.component';
import { AboutUsComponent } from '../../components/about-us/about-us.component';
import { HeroBannerSkeletonComponent } from '@shared/components/skeleton/hero-banner-skeleton.component';
import { CategoriesSkeletonComponent } from '@shared/components/skeleton/categories-skeleton.component';
import { ProductsGridSkeletonComponent } from '@shared/components/skeleton/products-grid-skeleton.component';
import { OffersGridSkeletonComponent } from '@shared/components/skeleton/offers-grid-skeleton.component';

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
  imports: [
    TranslatePipe, ProductCarouselSectionComponent, HeroCarouselComponent,
    CategoryBannersSectionComponent, AboutUsComponent,
    HeroBannerSkeletonComponent, CategoriesSkeletonComponent, ProductsGridSkeletonComponent, OffersGridSkeletonComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private productService = inject(ProductService);

  protected readonly loading = this.productService.productsLoading;
  protected readonly offers = offerProducts();
  protected readonly featured = this.productService.featured;

  constructor() {
    this.productService.loadFeatured(FEATURED_IDS);
  }
}
