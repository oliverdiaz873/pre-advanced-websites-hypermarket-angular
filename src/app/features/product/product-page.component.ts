import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { productById, productPageData, relatedProducts } from '@data/index';
import { getAssetUrl } from '@core/utils';
import { SeoService } from '@core/services/seo.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ProductDetailSectionComponent } from '@features/products/components/product-detail-section/product-detail-section.component';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';
import { ProductUI } from '@features/products/models/product-ui.interface';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [BreadcrumbComponent, EmptyStateComponent, ProductDetailSectionComponent, ProductCarouselSectionComponent],
  template: `
    @if (product()) {
      <app-breadcrumb [items]="[{ label: product()!.nombre }]"></app-breadcrumb>
      <app-product-detail-section [product]="product()!" [pageData]="pageData()"></app-product-detail-section>
      <app-product-carousel-section title="Productos relacionados" [products]="related()"></app-product-carousel-section>
    } @else {
      <app-empty-state title="Producto no encontrado" message="No encontramos el producto solicitado." actionLabel="Volver al inicio" actionUrl="/"></app-empty-state>
    }
  `,
  styles: [`:host { display: grid; gap: 1.5rem; }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);
  readonly productId = signal('');

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.productId.set(params.get('id') ?? '');
      this.applyProductSeo();
    });
  }

  product(): ProductUI | undefined { return productById(this.productId()); }
  pageData() { return productPageData[this.productId()]; }
  related(): ProductUI[] { return this.product() ? relatedProducts(this.product()!) : []; }

  private applyProductSeo(): void {
    const product = this.product();
    const canonicalPath = `/product/${this.productId()}`;

    if (!product) {
      this.seo.applySeo({
        title: 'Producto no encontrado',
        description: 'No encontramos el producto solicitado en Hypermarket.',
        canonicalPath,
        jsonLd: null,
        robots: 'noindex, nofollow'
      });
      return;
    }

    const description = this.pageData()?.descripcion ?? `${product.nombre} disponible en Hypermarket por ${product.precioTexto}.`;
    const imageUrl = this.seo.absoluteUrl(getAssetUrl(product.imagen));

    this.seo.applySeo({
      title: product.nombre,
      description,
      canonicalPath,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.nombre,
        image: [imageUrl],
        description,
        sku: product.id,
        category: product.categoria,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'DOP',
          price: product.precio,
          availability: 'https://schema.org/InStock',
          url: this.seo.absoluteUrl(canonicalPath)
        }
      }
    });
  }
}
