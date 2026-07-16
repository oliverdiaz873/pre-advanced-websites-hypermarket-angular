import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { categories, categorySections } from '@data/index';
import { SeoService } from '@core/services/seo.service';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ProductCarouselSectionComponent } from '@features/products/components/product-carousel-section/product-carousel-section.component';
import { ProductGridComponent } from '@features/products/components/product-grid/product-grid.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [BreadcrumbComponent, EmptyStateComponent, ProductCarouselSectionComponent, ProductGridComponent],
  template: `
    <app-breadcrumb variant="category" [items]="breadcrumbItems()"></app-breadcrumb>

    @if (category()) {
      <section class="category-hero">
        <div>
          <span>Categoria</span>
          <h1>{{ categoryName() }}</h1>
          <p>Explora productos organizados por subcategoria y encuentra rapido lo que necesitas.</p>
        </div>
      </section>

      <div class="filters" aria-label="Subcategorias">
        <button type="button" [class.active]="selectedSection() === 'all'" (click)="selectedSection.set('all')">Todo</button>
        @for (section of sections(); track section.id) {
          <button type="button" [class.active]="selectedSection() === section.id" (click)="selectedSection.set(section.id)">{{ section.name }}</button>
        }
      </div>

      @if (selectedSection() === 'all') {
        @for (section of sections(); track section.id; let i = $index) {
          @if (section.products.length) {
            <app-product-carousel-section [title]="section.name" [products]="section.products" [sectionClass]="i === 0 ? 'category-page-first-carousel' : ''" [id]="section.id" [idPrefix]="categoryId() + '-' + section.id"></app-product-carousel-section>
          }
        }
      } @else {
        <app-product-grid [products]="filteredProducts()"></app-product-grid>
      }
    } @else {
      <app-empty-state title="Categoria no encontrada" description="La categoria solicitada no existe o aun no esta disponible." actionLabel="Volver al inicio" actionHref="/"></app-empty-state>
    }
  `,
  styles: [`
    :host { display: grid; gap: 1.5rem; }
    .category-hero { padding: 2rem; border-radius: 0.5rem; background: #0f172a; color: #fff; }
    .category-hero span { color: #fde047; font-weight: 900; text-transform: uppercase; font-size: 0.8rem; }
    h1 { margin: 0.35rem 0; font-size: clamp(2rem, 4vw, 3.5rem); letter-spacing: 0; }
    p { margin: 0; color: #cbd5e1; }
    .filters { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem; }
    button { min-height: 2.5rem; padding: 0 0.9rem; border-radius: 0.5rem; border: 1px solid #d1d5db; background: #fff; color: #111827; font-weight: 800; white-space: nowrap; cursor: pointer; }
    button.active { background: #111827; color: #fff; border-color: #111827; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);
  private readonly langVersion = signal(0);
  readonly categoryId = signal('');
  readonly selectedSection = signal('all');

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    this.langVersion();
    const catId = this.categoryId();
    return [
      { label: this.translate.instant('common.breadcrumb.home'), url: '/' },
      { label: catId ? this.translate.instant('categories.' + catId) : this.categoryName() },
    ];
  });

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.langVersion.update(v => v + 1));

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.categoryId.set(params.get('id') ?? '');
      this.selectedSection.set('all');
      this.applyCategorySeo();
    });
  }

  category() { return categories.find(item => item.id === this.categoryId()); }
  categoryName() { return this.category()?.name ?? 'Categoria'; }
  sections() { return categorySections(this.categoryId()); }
  filteredProducts() { return this.sections().find(section => section.id === this.selectedSection())?.products ?? []; }

  private applyCategorySeo(): void {
    const category = this.category();
    const canonicalPath = `/category/${this.categoryId()}`;

    if (!category) {
      this.seo.applySeo({
        title: 'Categoria no encontrada',
        description: 'La categoria solicitada no existe o aun no esta disponible en Hypermarket.',
        canonicalPath,
        jsonLd: null,
        robots: 'noindex, nofollow'
      });
      return;
    }

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
