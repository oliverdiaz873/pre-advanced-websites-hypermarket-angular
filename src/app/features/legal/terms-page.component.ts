import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalLayoutComponent } from '../layout/components/legal-layout/legal-layout.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [LegalLayoutComponent, TranslatePipe],
  template: `
    <app-legal-layout [title]="'legal.terms.title' | translate" [date]="'legal.terms.date' | translate">
      <p>{{ 'legal.terms.intro' | translate }}</p>
      <h2>{{ 'legal.terms.sections.1.title' | translate }}</h2>
      <p>{{ 'legal.terms.sections.1.content' | translate }}</p>
      <h2>{{ 'legal.terms.sections.2.title' | translate }}</h2>
      <p>{{ 'legal.terms.sections.2.content' | translate }}</p>
      <h2>{{ 'legal.terms.sections.3.title' | translate }}</h2>
      <p>{{ 'legal.terms.sections.3.content' | translate }}</p>
      <h2>{{ 'legal.terms.sections.4.title' | translate }}</h2>
      <p>{{ 'legal.terms.sections.4.content' | translate }}</p>
      <h2>{{ 'legal.terms.sections.5.title' | translate }}</h2>
      <p>{{ 'legal.terms.sections.5.content' | translate }}</p>
      <h2>{{ 'legal.terms.sections.6.title' | translate }}</h2>
      <p>{{ 'legal.terms.sections.6.content' | translate }}</p>
      <h2>{{ 'legal.terms.sections.7.title' | translate }}</h2>
      <p>{{ 'legal.terms.sections.7.content' | translate }}</p>
      <h2>{{ 'legal.terms.sections.8.title' | translate }}</h2>
      <p>
        {{ 'legal.terms.sections.8.content' | translate }}
        <a href="mailto:{{ 'legal.terms.sections.8.email' | translate }}">
          <strong>{{ 'legal.terms.sections.8.email' | translate }}</strong>
        </a>
      </p>
    </app-legal-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsPageComponent {}
