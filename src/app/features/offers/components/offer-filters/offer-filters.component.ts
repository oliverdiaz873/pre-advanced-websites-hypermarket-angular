import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferFiltersService } from '../../services/offer-filters.service';

@Component({
  selector: 'app-offer-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="offer-filters" [class.offer-filters--drawer]="isDrawer">
      @if (!isDrawer) {
        <div class="offer-filters__header">
          <h2 class="offer-filters__title">Filtros</h2>
          <div class="offer-filters__badge">{{ service.filteredProducts().length }} / {{ service.offers.length }}</div>
        </div>
      }

      <div class="offer-filters__section">
        <label class="offer-filters__option" [class.is-active]="service.selectedCategory() === 'all'">
          <input type="radio" name="category" value="all" [checked]="service.selectedCategory() === 'all'" (change)="service.selectCategory('all')" />
          <span class="offer-filters__indicator"></span>
          <span class="offer-filters__label">Todas las categorias</span>
        </label>

        @for (cat of service.categories(); track cat.id) {
          <label class="offer-filters__option" [class.is-active]="service.selectedCategory() === cat.id">
            <input type="radio" name="category" [value]="cat.id" [checked]="service.selectedCategory() === cat.id" (change)="service.selectCategory(cat.id)" />
            <span class="offer-filters__indicator"></span>
            <span class="offer-filters__label">{{ cat.name }}</span>
            <span class="offer-filters__count">({{ cat.count }})</span>
          </label>
        }
      </div>

      @if (!isDrawer) {
        <div class="offer-filters__info">
          Mostrando <strong>{{ service.filteredProducts().length }}</strong> de <strong>{{ service.offers.length }}</strong> ofertas
        </div>
      }
    </div>
  `,
  styles: [`
    .offer-filters {
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      color: #fff;
    }

    .offer-filters--drawer {
      background: transparent;
      backdrop-filter: none;
      border-radius: 0;
      padding: 1rem;
      box-shadow: none;
    }

    .offer-filters__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(255,255,255,0.1);
      margin-bottom: 1rem;
    }

    .offer-filters__title {
      font-size: 1.1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
      color: #fff;
    }

    .offer-filters__badge {
      background: rgba(255,107,53,0.2);
      border: 1px solid rgba(255,107,53,0.5);
      color: #ff6b35;
      border-radius: 999px;
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .offer-filters__section {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .offer-filters--drawer .offer-filters__section {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      flex-direction: row;
    }

    .offer-filters__option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 200ms;
    }

    .offer-filters__option:hover {
      background-color: rgba(255,107,53,0.08);
    }

    .offer-filters__option input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .offer-filters__indicator {
      display: block;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.6);
      border-radius: 50%;
      flex-shrink: 0;
      transition: all 200ms;
    }

    .offer-filters__option.is-active .offer-filters__indicator {
      background: radial-gradient(circle at center, #ff6b35 60%, transparent 65%);
      border-color: #ff6b35;
      box-shadow: 0 0 12px rgba(255,107,53,0.5);
    }

    .offer-filters__label {
      font-size: 0.95rem;
      color: rgba(255,255,255,0.85);
    }

    .offer-filters__option.is-active .offer-filters__label {
      color: #fff;
      font-weight: 700;
    }

    .offer-filters__count {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.5);
      margin-left: auto;
    }

    .offer-filters__info {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6);
      font-size: 0.875rem;
    }

    .offer-filters__info strong {
      color: #ff6b35;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferFiltersComponent {
  @Input() isDrawer = false;
  protected service = inject(OfferFiltersService);
}
