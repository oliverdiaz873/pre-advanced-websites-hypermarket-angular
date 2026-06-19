import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { ProductGridComponent } from '@features/products/components/product-grid/product-grid.component';
import { OfferFiltersComponent } from './components/offer-filters/offer-filters.component';
import { OfferFiltersService } from './services/offer-filters.service';

@Component({
  selector: 'app-offers-page',
  standalone: true,
  imports: [BreadcrumbComponent, EmptyStateComponent, DrawerComponent, ProductGridComponent, OfferFiltersComponent],
  template: `
    <app-breadcrumb [items]="[{ label: 'Ofertas' }]"></app-breadcrumb>

    <div class="offers-page-wrapper">
      <section class="mx-auto w-full max-w-7xl px-2 pt-1 pb-8 md:px-6 min-h-[60vh] flex flex-col">
        <div class="offers-header-container flex items-center justify-between gap-4">
          <h1 class="offers-header__title flex items-center gap-1">
            <svg class="offers-header__icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
            </svg>
            Ofertas
          </h1>
          <button
            type="button"
            class="offers-mobile-filters-btn lg:hidden"
            (click)="isDrawerOpen.set(true)"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
            Filtros
            @if (filtersService.selectedCategory() !== 'all') {
              <span class="offers-mobile-filters-active-chip">{{ selectedCategoryName() }}</span>
            }
          </button>
        </div>

        <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] flex-1">
          <aside class="hidden lg:block">
            <app-offer-filters></app-offer-filters>
          </aside>

          <div class="flex flex-col">
            @if (filteredProducts().length > 0) {
              <app-product-grid [products]="filteredProducts()"></app-product-grid>
            } @else {
              <app-empty-state title="Sin ofertas" message="No hay ofertas que coincidan con tu busqueda." actionLabel="Ver categorias" actionUrl="/"></app-empty-state>
            }
          </div>
        </div>
      </section>
    </div>

    <app-drawer [isOpen]="isDrawerOpen()" (closeDrawer)="isDrawerOpen.set(false)">
      <app-offer-filters [isDrawer]="true"></app-offer-filters>
    </app-drawer>
  `,
  styles: [`
    .offers-page-wrapper {
      background-color: #ffffff;
      color: #111827;
      min-height: 100vh;
    }

    .offers-header-container {
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    }

    .offers-header__title {
      font-size: 1.875rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .offers-header__icon {
      width: 2.5rem;
      height: 2.5rem;
      fill: #ff0000;
      background: radial-gradient(circle at 50% 65%, #ffff00 32%, transparent 34%);
      border-radius: 50%;
    }

    @media (min-width: 768px) {
      .offers-header__icon { width: 1.75rem; height: 1.75rem; }
    }

    .offers-mobile-filters-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      color: white;
      border-radius: 999px;
      border: none;
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255,107,53,0.3);
      transition: transform 200ms;
      font-family: inherit;
      line-height: inherit;
    }

    .offers-mobile-filters-btn:active {
      transform: scale(0.96);
    }

    .offers-mobile-filters-active-chip {
      background: rgba(255,255,255,0.2);
      border-radius: 999px;
      padding: 0.125rem 0.5rem;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.75rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersPageComponent {
  protected filtersService = inject(OfferFiltersService);
  protected isDrawerOpen = signal(false);

  protected readonly filteredProducts = computed(() => {
    return this.filtersService.filteredProducts();
  });

  protected readonly selectedCategoryName = computed(() => {
    const selectedId = this.filtersService.selectedCategory();
    const cat = this.filtersService.categories().find(c => c.id === selectedId);
    return cat?.name ?? '';
  });
}
