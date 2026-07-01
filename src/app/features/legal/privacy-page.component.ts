import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalLayoutComponent } from '../layout/components/legal-layout/legal-layout.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [LegalLayoutComponent, TranslatePipe],
  template: `
    <app-legal-layout [title]="'legal.privacy.title' | translate" [date]="'legal.privacy.date' | translate">
      <p>{{ 'legal.privacy.intro' | translate }}</p>
      <h2>{{ 'legal.privacy.sections.1.title' | translate }}</h2>
      <p>{{ 'legal.privacy.sections.1.content' | translate }}</p>
      <h2>{{ 'legal.privacy.sections.2.title' | translate }}</h2>
      <p>{{ 'legal.privacy.sections.2.content' | translate }}</p>
      <h2>{{ 'legal.privacy.sections.3.title' | translate }}</h2>
      <p>{{ 'legal.privacy.sections.3.content' | translate }}</p>
      <h2>{{ 'legal.privacy.sections.4.title' | translate }}</h2>
      <p>{{ 'legal.privacy.sections.4.content' | translate }}</p>
      <h2>{{ 'legal.privacy.sections.5.title' | translate }}</h2>
      <p>{{ 'legal.privacy.sections.5.content' | translate }}</p>
      <h2>{{ 'legal.privacy.sections.6.title' | translate }}</h2>
      <p>
        {{ 'legal.privacy.sections.6.content' | translate }}
        <a href="mailto:{{ 'legal.privacy.sections.6.email' | translate }}">
          <strong>{{ 'legal.privacy.sections.6.email' | translate }}</strong>
        </a>
      </p>
    </app-legal-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPageComponent {}
