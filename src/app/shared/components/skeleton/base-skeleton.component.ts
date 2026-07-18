import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-skeleton',
  standalone: true,
  template: `
    <div
      [class]="skeletonClasses"
      role="status"
      aria-label="Loading"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseSkeletonComponent {
  @Input() className = 'w-full h-10';

  @Input()
  shape: 'rectangle' | 'circle' = 'rectangle';

  get skeletonClasses(): string {
    const shapeClass =
      this.shape === 'circle'
        ? 'rounded-full'
        : 'rounded-lg';

    return `
      ${this.className}
      ${shapeClass}
      bg-gray-200
      animate-pulse
    `;
  }
}
