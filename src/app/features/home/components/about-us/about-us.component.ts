import { Component, ViewChild, ElementRef, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getAssetUrl } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
/**
 * AboutUsComponent
 *
 * Renders the "About Us" section with a logo image, title and description.
 * On scroll, applies a scale+opacity animation (smooth interpolation via rAF)
 * that mirrors the Framer Motion spring-driven animation in the Next.js version.
 * Uses a manual scroll-driven progress calculation since Angular lacks a native
 * scroll-linked animation framework.
 */
export class AboutUsComponent implements OnInit, OnDestroy {
  protected readonly getAssetUrl = getAssetUrl;
  protected transformStyle = 'scale(1)';
  protected opacity = 1;

  @ViewChild('aboutSection', { static: true }) private sectionRef!: ElementRef<HTMLElement>;

  private isBrowser: boolean;
  private isMobile = false;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId = 0;
  private currentScale = 1;
  private currentOpacity = 1;
  private targetScale = 1;
  private targetOpacity = 1;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.checkMobile();
    this.updateTargets();
    this.currentScale = this.targetScale;
    this.currentOpacity = this.targetOpacity;
    this.applyValues();
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  @HostListener('window:resize')
  protected onResize(): void {
    if (!this.isBrowser) return;
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.checkMobile();
      this.updateTargets();
      this.smooth();
    }, 150);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll);
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 767.98;
  }

  private updateTargets(): void {
    const rect = this.sectionRef.nativeElement.getBoundingClientRect();
    const vh = window.innerHeight;
    const height = rect.height;

    let progress: number;

    if (this.isMobile) {
      const startTop = 0.9 * vh;
      const endTop = 0.35 * vh;
      const totalDist = startTop - endTop;
      progress = totalDist > 0 ? (startTop - rect.top) / totalDist : 0;
    } else {
      const startTop = 1.02 * vh;
      const endTop = 0.6 * vh - height / 2;
      const totalDist = startTop - endTop;
      progress = totalDist > 0 ? (startTop - rect.top) / totalDist : 0;
    }

    progress = Math.max(0, Math.min(1, progress));

    if (this.isMobile) {
      this.targetScale = 0.88 + progress * 0.12;
      this.targetOpacity = Math.min(1, 0.82 + progress / 0.4 * 0.18);
    } else {
      this.targetScale = progress;
      this.targetOpacity = 1;
    }
  }

  private applyValues(): void {
    this.transformStyle = `scale(${this.currentScale})`;
    this.opacity = this.currentOpacity;
    this.cdr.markForCheck();
  }

  private smooth(): void {
    cancelAnimationFrame(this.rafId);

    const step = () => {
      this.currentScale += (this.targetScale - this.currentScale) * 0.12;
      this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.12;

      const nearScale = Math.abs(this.currentScale - this.targetScale) < 0.001;
      const nearOpacity = Math.abs(this.currentOpacity - this.targetOpacity) < 0.001;

      if (nearScale && nearOpacity) {
        this.currentScale = this.targetScale;
        this.currentOpacity = this.targetOpacity;
      }

      this.applyValues();

      if (!nearScale || !nearOpacity) {
        this.rafId = requestAnimationFrame(step);
      }
    };

    step();
  }

  private readonly onScroll = (): void => {
    this.updateTargets();
    this.smooth();
  };
}
