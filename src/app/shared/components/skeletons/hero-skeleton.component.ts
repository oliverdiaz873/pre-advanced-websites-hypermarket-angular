import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-skeleton',
  standalone: true,
  template: `
    <div class="hero-skeleton" aria-hidden="true">
      <span class="line large"></span>
      <span class="line"></span>
      <span class="button"></span>
    </div>
  `,
  styles: [`
    .hero-skeleton {
      min-height: 18rem;
      padding: 2rem;
      border-radius: 0.5rem;
      background: #e5e7eb;
      display: grid;
      align-content: center;
      gap: 1rem;
    }

    .line,
    .button {
      display: block;
      border-radius: 999px;
      background: linear-gradient(90deg, #d1d5db 25%, #f3f4f6 37%, #d1d5db 63%);
      background-size: 400% 100%;
      animation: shimmer 1.4s ease infinite;
    }

    .large {
      width: min(32rem, 80%);
      height: 2.25rem;
    }

    .line:not(.large) {
      width: min(24rem, 70%);
      height: 1rem;
    }

    .button {
      width: 8rem;
      height: 2.5rem;
    }

    @keyframes shimmer {
      0% { background-position: 100% 0; }
      100% { background-position: 0 0; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSkeletonComponent {}
