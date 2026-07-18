import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

/**
 * Component: ScrollToTop
 * Purpose: Manages the application's global scroll behavior.
 *
 * 1. After navigating to a new route without a hash, scrolls the page to the top.
 * 2. If the current URL contains a hash (#section), waits briefly for the view to
 *    render, then smoothly scrolls the target element into the center of the viewport.
 */
@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollToTopComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (!isPlatformBrowser(this.platformId)) {
          return;
        }

        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        const hash = window.location.hash;

        if (!hash) {
          window.scrollTo(0, 0);
        } else {
          const id = hash.replace('#', '');
          this.timeoutId = setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          }, 150);
        }
      });

    this.destroyRef.onDestroy(() => {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
      }
    });
  }
}
