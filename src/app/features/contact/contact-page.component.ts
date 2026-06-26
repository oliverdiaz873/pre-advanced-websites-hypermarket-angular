import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [TranslatePipe, ContactFormComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent implements OnInit, OnDestroy {
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
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

  showSuccessToast(): void {
    this.toast.success(this.translate.instant('contact.form.success_toast'));
  }
}
