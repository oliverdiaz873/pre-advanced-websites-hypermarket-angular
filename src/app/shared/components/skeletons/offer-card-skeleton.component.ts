import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-offer-card-skeleton',
  standalone: true,
  template: `
    <div class="offer-skeleton" aria-hidden="true">
      @for (item of placeholders; track item) {
        <div class="card">
          <span class="badge shimmer"></span>
          <span class="image shimmer"></span>
          <span class="line shimmer"></span>
          <span class="line short shimmer"></span>
          <span class="button shimmer"></span>
        </div>
      }
    </div>
  `,
  styles: [`
    .offer-skeleton {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1.25rem;
    }

    .card {
      min-height: 20rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: #fff;
      display: grid;
      gap: 0.75rem;
      align-content: start;
      position: relative;
    }

    .badge {
      width: 4rem;
      height: 1.5rem;
      border-radius: 999px;
    }

    .image {
      height: 8rem;
      border-radius: 0.5rem;
    }

    .line {
      height: 1rem;
      border-radius: 999px;
    }

    .short {
      width: 60%;
    }

    .button {
      align-self: end;
      height: 2.25rem;
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
export class OfferCardSkeletonComponent {
  @Input() count = 6;

  get placeholders(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
