import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { categories, categorySections } from '@data/index';
import { SeoService } from '@core/services/seo.service';
import { BRAND_NAME } from '@core/constants';
import { getCategoryName, getSubcategoryName } from '@core/utils';
import { ProductService } from '@features/products/services/product.service';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';
import { BaseSkeletonComponent } from '@shared/components/skeleton/base-skeleton.component';
import { ProductsGridSkeletonComponent } from '@shared/components/skeleton/products-grid-skeleton.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCarouselSectionComponent, BaseSkeletonComponent, ProductsGridSkeletonComponent],
  template: `
    @if (loading()) {
      <div class="w-full bg-white px-4 md:px-8 py-4 md:py-6">
        <div class="max-w-7xl mx-auto">
          <app-base-skeleton className="h-5 w-56 rounded"></app-base-skeleton>
        </div>
      </div>

      <div class="w-full bg-white px-4 md:px-8 py-4 md:py-6 border-b border-gray-100">
        <div class="max-w-7xl mx-auto">
          <app-base-skeleton className="h-10 md:h-12 w-64 rounded mb-2"></app-base-skeleton>
          <app-base-skeleton className="h-5 w-full max-w-2xl rounded"></app-base-skeleton>
        </div>
      </div>

      <div class="w-full bg-gray-50 py-6 md:py-8">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div class="hidden lg:block space-y-4">
              @for (item of [1,2,3]; track item) {
                <div class="bg-white p-4 rounded-lg">
                  <app-base-skeleton className="h-5 w-32 rounded mb-3"></app-base-skeleton>
                  <div class="space-y-2">
                    @for (sub of [1,2,3,4]; track sub) {
                      <app-base-skeleton className="h-4 w-24 rounded"></app-base-skeleton>
                    }
                  </div>
                </div>
              }
            </div>
            <div class="lg:col-span-3">
              <app-products-grid-skeleton [count]="12"></app-products-grid-skeleton>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <app-breadcrumb variant="category" [items]="breadcrumbItems()"></app-breadcrumb>

      <div class="category-page-content">
        @for (section of sections(); track section.id; let i = $index) {
          @if (section.products.length) {
            <app-product-carousel-section
              [title]="sectionTitle(section.id)"
              [products]="section.products"
              [sectionClass]="i === 0 ? 'category-page-first-carousel' : ''"
              [id]="section.id"
              [idPrefix]="categoryId() + '-' + section.id"
            ></app-product-carousel-section>
          }
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .category-page-content { padding-top: 23px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPageComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);
  private readonly productService = inject(ProductService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly langVersion = signal(0);
  readonly categoryId = signal('');

  protected readonly loading = this.productService.productsLoading;

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    this.langVersion();
    const catId = this.categoryId();
    return [
      { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
      { label: catId ? this.translate.instant('categories.' + catId) : '' },
    ];
  });

  constructor() {
    this.productService.loadProducts({});

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.langVersion.update(v => v + 1);
        this.applyCategorySeo();
      });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = params.get('id') ?? '';
      this.categoryId.set(id);

      if (!categories.find(item => item.id === id)) {
        this.router.navigate(['/not-found']);
        return;
      }

      this.applyCategorySeo();
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.route.fragment
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(fragment => {
        if (!fragment) return;

        setTimeout(() => {
          const element = document.getElementById(fragment);

          if (!element) return;

          const y = element.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: y,
            behavior: 'auto'
          });
        }, 0);
      });
  }

  category() { return categories.find(item => item.id === this.categoryId()); }
  sections() { return categorySections(this.categoryId()); }

  sectionTitle(sectionId: string): string {
    const key = `categories.sub.${sectionId}`;
    const translated = this.translate.instant(key);
    return translated !== key
      ? translated
      : this.sections().find(section => section.id === sectionId)?.name ?? '';
  }

  private localeMap: Record<string, string> = { es: 'es_DO', en: 'en_US' };

  private applyCategorySeo(): void {
    const category = this.category();
    const canonicalPath = `/category/${this.categoryId()}`;

    if (!category) {
      this.seo.applySeo({
        titleKey: 'categories.not_found',
        description: this.translate.instant('categories.not_found_description'),
        canonicalPath,
        jsonLd: null,
        robots: 'noindex, nofollow'
      });
      return;
    }

    const sections = this.sections();
    const productCount = sections.reduce((total, section) => total + section.products.length, 0);
    const translatedName = getCategoryName(category, this.translate);
    const subcategoryNames = category.subcategories.map(s => getSubcategoryName(s, this.translate)).join(', ');
    const currentLang = this.translate.currentLang() ?? 'es';
    const locale = this.localeMap[currentLang] ?? 'es_DO';

    const description = this.translate.instant('categories.seo.description', {
      name: translatedName,
      subcategories: subcategoryNames
    });

    this.seo.applySeo({
      title: translatedName,
      description,
      canonicalPath,
      openGraph: {
        type: 'website',
        locale,
        url: this.seo.absoluteUrl(canonicalPath)
      },
      twitter: {
        card: 'summary_large_image'
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: translatedName,
        url: this.seo.absoluteUrl(canonicalPath),
        mainEntity: {
          '@type': 'ItemList',
          name: translatedName,
          numberOfItems: productCount,
          itemListElement: category.subcategories.map((subcategory, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: getSubcategoryName(subcategory, this.translate),
            url: this.seo.absoluteUrl(subcategory.href)
          }))
        },
        provider: {
          '@type': 'Organization',
          name: BRAND_NAME,
          url: this.seo.absoluteUrl('/')
        }
      }
    });
  }
}
