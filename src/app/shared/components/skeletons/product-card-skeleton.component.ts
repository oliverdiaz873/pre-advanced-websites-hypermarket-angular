import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  template: `
    <div class="product-card-skeleton" aria-hidden="true">
      @for (item of placeholders; track item) {
        <div class="card">
          <span class="image shimmer"></span>
          <span class="line shimmer"></span>
          <span class="line short shimmer"></span>
          <span class="line price shimmer"></span>
          <span class="button shimmer"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-card-skeleton {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1.25rem;
    }

    .card {
      min-height: 18rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: #fff;
      display: grid;
      gap: 0.5rem;
      align-content: start;
    }

    .image {
      height: 7rem;
      border-radius: 0.5rem;
    }

    .line {
      height: 0.875rem;
      border-radius: 999px;
    }

    .short {
      width: 55%;
    }

    .price {
      width: 40%;
      height: 1.125rem;
    }

    .button {
      align-self: end;
      height: 2rem;
      border-radius: 0.5rem;
      margin-top: 0.5rem;
    }

    .shimmer {
      background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
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
export class ProductCardSkeletonComponent {
  @Input() count = 8;

  get placeholders(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
