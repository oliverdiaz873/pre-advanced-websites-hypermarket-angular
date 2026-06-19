import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-categories-skeleton',
  standalone: true,
  template: `
    <div class="categories-skeleton" aria-hidden="true">
      @for (item of [1,2,3,4]; track item) {
        <div class="category-card">
          <span class="image shimmer"></span>
          <span class="line shimmer"></span>
          <span class="line short shimmer"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .categories-skeleton {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .category-card {
      min-height: 200px;
      padding: 1.5rem;
      border-radius: 18px;
      background: #e5e7eb;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .image {
      height: 120px;
      border-radius: 0.75rem;
    }

    .line {
      height: 1rem;
      border-radius: 999px;
      width: 70%;
    }

    .short {
      width: 50%;
    }

    .shimmer {
      background: linear-gradient(90deg, #d1d5db 25%, #f3f4f6 37%, #d1d5db 63%);
      background-size: 400% 100%;
      animation: shimmer 1.4s ease infinite;
    }

    @keyframes shimmer {
      0% { background-position: 100% 0; }
      100% { background-position: 0 0; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesSkeletonComponent {}
