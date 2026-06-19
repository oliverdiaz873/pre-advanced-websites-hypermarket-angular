import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-skeleton',
  standalone: true,
  template: `
    <div class="base-skeleton" [style.min-height.px]="height" [style.width]="width" aria-hidden="true">
      <span class="shimmer"></span>
    </div>
  `,
  styles: [`
    .base-skeleton {
      display: block;
      border-radius: 0.5rem;
      background: #e5e7eb;
      overflow: hidden;
      position: relative;
    }

    .shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 37%, transparent 63%);
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
export class BaseSkeletonComponent {
  @Input() height = 20;
  @Input() width = '100%';
}
