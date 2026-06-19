import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  template: `
    @if (visible()) {
      <button type="button" class="scroll-top" aria-label="Volver arriba" (click)="scrollTop()">^</button>
    }
  `,
  styles: [`
    .scroll-top {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 30;
      width: 2.75rem;
      height: 2.75rem;
      border: 0;
      border-radius: 999px;
      background: #111827;
      color: #fff;
      font-size: 1.25rem;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 12px 24px rgba(17, 24, 39, 0.25);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollToTopComponent {
  private readonly platformId = inject(PLATFORM_ID);
  readonly visible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.visible.set(window.scrollY > 480);
    }
  }

  scrollTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
