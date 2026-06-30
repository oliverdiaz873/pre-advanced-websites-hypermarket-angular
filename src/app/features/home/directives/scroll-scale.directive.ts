import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appScrollScale]',
  standalone: true,
})
/**
 * ScrollScaleDirective
 *
 * Manages the scale animation of an element based on scroll progress.
 * Calculates the visibility of the section within the viewport and applies
 * an inline transform scale + opacity (mobile) or scale only (desktop).
 * Includes acceleration/easing on mobile and requestAnimationFrame throttling.
 *
 * Uses Renderer2 to write styles directly to the DOM, bypassing Angular's
 * change detection cycle — required because scroll updates run outside
 * Angular zone for performance.
 *
 * Usage: <section appScrollScale>
 */
export class ScrollScaleDirective implements OnInit, OnDestroy {
  private frameId = 0;
  private timer: any;

  // Spring State Variables
  private initialized = false;
  private animFrameId = 0;
  private lastTime = 0;

  private currentScale = 0.001;
  private targetScale = 0.001;
  private velocityScale = 0;

  private currentOpacity = 1;
  private targetOpacity = 1;
  private velocityOpacity = 0;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.onScroll = this.onScroll.bind(this);
      this.updateScale = this.updateScale.bind(this);

      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);

      this.updateScale();
      this.timer = window.setTimeout(this.updateScale, 100);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    window.clearTimeout(this.timer);

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  private isMobile(): boolean {
    return window.innerWidth <= 767.98;
  }

  private onScroll(): void {
    if (this.frameId) return;

    this.frameId = requestAnimationFrame(() => {
      this.frameId = 0;
      this.updateScale();
    });
  }

  private updateScale(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height || 1;
    const mobile = this.isMobile();

    let progress = 0;

    if (mobile) {
      // Mobile: ["start 90%", "start 35%"]
      const topStart = windowHeight * 0.9;
      const topEnd = windowHeight * 0.35;
      progress = (topStart - sectionTop) / Math.max(1, topStart - topEnd);
    } else {
      // Desktop: ["start 102%", "center 60%"]
      const topStart = windowHeight * 1.02;
      const centerEnd = windowHeight * 0.6;
      const sectionTopAtEnd = centerEnd - sectionHeight / 2;
      progress = (topStart - sectionTop) / Math.max(1, topStart - sectionTopAtEnd);
    }

    progress = Math.min(1, Math.max(0, progress));

    const safeProgress = Math.max(0.001, progress);

    if (mobile) {
      const accelerated = Math.min(1, safeProgress * 1.35);
      const eased = 1 - Math.pow(1 - accelerated, 3);

      this.targetScale = 0.88 + eased * 0.12;
      this.targetOpacity = 0.82 + eased * 0.18;
    } else {
      // Desktop scale range [0.3, 1] — matches the visual behavior of Framer Motion's
      // useSpring lag which prevents the element from ever appearing near scale(0).
      this.targetScale = 0.3 + safeProgress * 0.7;
      this.targetOpacity = 1;
    }

    if (!this.initialized) {
      this.currentScale = this.targetScale;
      this.currentOpacity = this.targetOpacity;
      this.initialized = true;
      this.applyStyles(this.currentScale, this.currentOpacity);
      return;
    }

    this.startAnimationLoop();
  }

  private startAnimationLoop(): void {
    if (this.animFrameId) return;
    this.lastTime = performance.now();
    this.animFrameId = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    const now = performance.now();
    let dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (dt > 0.1) dt = 0.1;
    if (dt <= 0) {
      this.animFrameId = requestAnimationFrame(() => this.tick());
      return;
    }

    const mobile = this.isMobile();
    const stiffness = mobile ? 100 : 150;
    const damping = mobile ? 30 : 25;
    const restDelta = 0.001;

    // Sub-stepping integration (1ms steps) for numerical stability and speed
    const stepSize = 0.001;
    let timeLeft = dt;

    while (timeLeft > 0) {
      const currentStep = Math.min(timeLeft, stepSize);

      // Scale physics step
      const forceScale = -stiffness * (this.currentScale - this.targetScale);
      const dampScale = -damping * this.velocityScale;
      const accScale = forceScale + dampScale;
      this.velocityScale += accScale * currentStep;
      this.currentScale += this.velocityScale * currentStep;

      // Opacity physics step
      const forceOpacity = -stiffness * (this.currentOpacity - this.targetOpacity);
      const dampOpacity = -damping * this.velocityOpacity;
      const accOpacity = forceOpacity + dampOpacity;
      this.velocityOpacity += accOpacity * currentStep;
      this.currentOpacity += this.velocityOpacity * currentStep;

      timeLeft -= currentStep;
    }

    // Snapping and rest state conditions
    const scaleAtRest = Math.abs(this.currentScale - this.targetScale) < restDelta && Math.abs(this.velocityScale) < restDelta;
    const opacityAtRest = Math.abs(this.currentOpacity - this.targetOpacity) < restDelta && Math.abs(this.velocityOpacity) < restDelta;

    if (scaleAtRest && opacityAtRest) {
      this.currentScale = this.targetScale;
      this.currentOpacity = this.targetOpacity;
      this.velocityScale = 0;
      this.velocityOpacity = 0;
      this.applyStyles(this.currentScale, this.currentOpacity);
      this.animFrameId = 0;
    } else {
      this.applyStyles(this.currentScale, this.currentOpacity);
      this.animFrameId = requestAnimationFrame(() => this.tick());
    }
  }

  private applyStyles(scale: number, opacity: number): void {
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${scale})`);
    this.renderer.setStyle(this.el.nativeElement, 'opacity', String(opacity));
  }
}
