import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-legal-layout',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <app-breadcrumb [items]="[{ label: title }]"></app-breadcrumb>
    <article class="legal">
      <h1>{{ title }}</h1>
      <ng-content></ng-content>
    </article>
  `,
  styles: [`
    .legal { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: clamp(1rem, 3vw, 2rem); color: #1f2937; }
    h1 { margin: 0 0 1rem; color: #111827; font-size: 2.25rem; letter-spacing: 0; }
    :host ::ng-deep h2 { margin-top: 1.5rem; color: #111827; }
    :host ::ng-deep p { line-height: 1.7; color: #4b5563; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalLayoutComponent {
  @Input() title = 'Legal';
}
