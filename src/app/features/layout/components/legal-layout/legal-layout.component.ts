import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-legal-layout',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <main class="politica-container">
      <h1>{{ title }}</h1>
      <p><small>{{ 'legal.last_updated' | translate }}: {{ date }}</small></p>
      <ng-content></ng-content>
    </main>
  `,
  styleUrl: './legal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalLayoutComponent implements OnInit, OnDestroy {
  @Input() title = 'Legal';
  @Input() date = '';

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      document.body.classList.add('dark-theme-body');
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      document.body.classList.remove('dark-theme-body');
    }
  }
}
