import { Directive, ElementRef, Input, OnInit, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() scrollAnimation: 'fade-up' | 'fade-scale' | 'slide-left' | 'slide-right' = 'fade-up';
  @Input() scrollDelay = 0;
  @Input() scrollThreshold = 0.15;

  private el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    const element = this.el.nativeElement;
    element.style.opacity = '0';
    element.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
    element.style.transitionDelay = `${this.scrollDelay}ms`;

    switch (this.scrollAnimation) {
      case 'fade-up':
        element.style.transform = 'translateY(30px)';
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
      { threshold: this.scrollThreshold }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
