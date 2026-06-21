import { Directive, ElementRef, Input, OnInit, OnDestroy, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Easing curve from Next.js: [0.25, 0.46, 0.45, 0.94]
const EASING_CURVE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() scrollAnimation: 'fade-up' | 'fade-scale' | 'slide-left' | 'slide-right' = 'fade-up';
  @Input() scrollDelay = 0;
  @Input() scrollThreshold = 0.15;
  @Input() scrollMargin = '0px';

  private el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const element = this.el.nativeElement;
    element.style.opacity = '0';
    element.style.transition = `opacity 0.6s ${EASING_CURVE}, transform 0.6s ${EASING_CURVE}`;
    element.style.transitionDelay = `${this.scrollDelay}ms`;

    switch (this.scrollAnimation) {
      case 'fade-up':
        element.style.transform = 'translateY(40px)';
        break;
      case 'fade-scale':
        element.style.transform = 'scale(0.9)';
        break;
      case 'slide-left':
        element.style.transform = 'translateX(-30px)';
        break;
      case 'slide-right':
        element.style.transform = 'translateX(30px)';
        break;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1) translateX(0)';
          this.observer?.unobserve(element);
        }
      },
      {
        threshold: this.scrollThreshold,
        rootMargin: this.scrollMargin,
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
