import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { categories, categorySections } from '@data/index';
import { SeoService } from '@core/services/seo.service';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCarouselSectionComponent],
  template: `
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
  private readonly langVersion = signal(0);
  readonly categoryId = signal('');

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    this.langVersion();
    const catId = this.categoryId();
    return [
      { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
      { label: catId ? this.translate.instant('categories.' + catId) : '' },
    ];
  });

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.langVersion.update(v => v + 1));

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

  private applyCategorySeo(): void {
    const category = this.category();
    const canonicalPath = `/category/${this.categoryId()}`;

    if (!category) return;

    const productCount = this.sections().reduce((total, section) => total + section.products.length, 0);

    this.seo.applySeo({
      title: `${category.name} en Hypermarket`,
      description: `Explora ${category.name} en Hypermarket con productos organizados por subcategoria.`,
      canonicalPath,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category.name} en Hypermarket`,
        description: `Catalogo de ${category.name} con ${productCount} productos disponibles.`,
        url: this.seo.absoluteUrl(canonicalPath)
      }
    });
  }
}
