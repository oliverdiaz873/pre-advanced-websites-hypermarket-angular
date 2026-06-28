import { Injectable, PLATFORM_ID, inject, signal, computed, DestroyRef, Signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

interface CachedMediaQuery {
  signal: ReturnType<typeof signal<boolean>>;
  mediaQueryList: MediaQueryList;
  listener: (event: MediaQueryListEvent) => void;
}

/**
 * Tracks the viewport width and exposes reactive signals for responsive UI.
 *
 * Used by `CategoryBanner` together with `animations.ts` to apply
 * shorter durations, reduced translateY, and tighter stagger on mobile.
 * Uses `window.matchMedia` internally — SSR-safe (defaults to `false` until hydration).
 */
@Injectable({
  providedIn: 'root'
})
export class ViewportService {
  /**
   * Emits `true` when the viewport width is below the mobile breakpoint (768px).
   * SSR-safe: defaults to `false` in non-browser environments.
   */
  readonly isMobile: Signal<boolean>;
  /** Categorizes the current viewport as `'mobile'`, `'tablet'`, or `'desktop'`. */
  readonly viewportMode: Signal<ViewportMode>;

  private readonly isBrowser: boolean;
  private readonly cache = new Map<string, CachedMediaQuery>();

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const destroyRef = inject(DestroyRef);

    this.isBrowser = isPlatformBrowser(platformId);

    this.isMobile = computed(() => this.isBelow(768)());

    const mobileQuery = this.isBelow(768);
    const tabletQuery = this.matches('(min-width: 768px) and (max-width: 1199px)');

    this.viewportMode = computed(() => {
      if (mobileQuery()) return 'mobile';
      if (tabletQuery()) return 'tablet';
      return 'desktop';
    });

    destroyRef.onDestroy(() => this.destroy());
  }

  /**
   * Returns a signal that emits `true` when the viewport is at or below the given breakpoint.
   * @param breakpoint - Max width in pixels to be considered "mobile" (default: 768).
   */
  isBelow(breakpoint: number): Signal<boolean> {
    return this.matches(`(max-width: ${breakpoint}px)`);
  }

  matches(query: string): Signal<boolean> {
    const cached = this.cache.get(query);
    if (cached) return cached.signal;

    if (!this.isBrowser || typeof window.matchMedia !== 'function') {
      const fallback = signal(false);
      this.cache.set(query, { signal: fallback, mediaQueryList: null as unknown as MediaQueryList, listener: () => {} });
      return fallback;
    }

    const mql = window.matchMedia(query);
    const innerSignal = signal(mql.matches);
    const listener = (event: MediaQueryListEvent) => innerSignal.set(event.matches);

    mql.addEventListener('change', listener);

    const entry: CachedMediaQuery = { signal: innerSignal, mediaQueryList: mql, listener };
    this.cache.set(query, entry);

    return innerSignal;
  }

  private destroy(): void {
    for (const [, entry] of this.cache) {
      if (entry.mediaQueryList) {
        entry.mediaQueryList.removeEventListener('change', entry.listener);
      }
    }
    this.cache.clear();
  }
}
