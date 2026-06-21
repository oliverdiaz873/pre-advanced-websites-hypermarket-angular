import { Component, ElementRef, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getAssetUrl } from '@core/utils';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <!-- Wrapper seguro: SIN TRANSFORMACIONES, overflow hidden -->
    <div class="about-us-wrapper w-full overflow-hidden">
      <!-- Sección animada: transformaciones aisladas -->
      <section
        #aboutSection
        class="about-us-section w-full max-w-full mx-auto mt-10 mb-6 md:mt-9 md:mb-10 bg-black text-white py-5 rounded-[20px] overflow-hidden"
      >
        <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-16 py-4">
          <img
            [src]="getAssetUrl('assets/images/logo/logo-with-background.jpeg')"
            [alt]="'home.about_us.logo_alt' | translate"
            class="w-[180px] md:w-[250px] lg:w-[300px] h-auto rounded-[15px] shrink-0"
          />
          <div class="max-w-[600px] text-center md:text-left">
            <h2 class="text-2xl md:text-3xl font-semibold mb-4">
              {{ 'home.about_us.title' | translate }}
            </h2>
            <p class="text-base md:text-lg leading-relaxed">
              {{ 'home.about_us.description' | translate }}
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-us-wrapper {
      width: 100%;
      overflow: hidden;
    }

    .about-us-section {
      transform-origin: center center;
      transition: transform 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
      max-width: 100%;
      width: calc(100% - 40px);
    }

    @media (prefers-reduced-motion: reduce) {
      .about-us-section {
        transition: none !important;
      }
    }
  `]
})
export class AboutUsComponent implements OnInit, OnDestroy {
  protected readonly getAssetUrl = getAssetUrl;
  private isBrowser: boolean;
  private isReducedMotion = false;
  private scrollListener: (() => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private elRef: ElementRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.isReducedMotion) {
      this.setupScrollListener();
      this.handleScroll();
    }
  }

  private setupScrollListener(): void {
    this.scrollListener = () => this.handleScroll();
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private handleScroll(): void {
    const aboutSection = this.elRef.nativeElement.querySelector('.about-us-section') as HTMLElement;
    if (!aboutSection) return;

    const rect = aboutSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const scrollProgress = Math.max(0, Math.min(1, 1 - (rect.bottom / (viewportHeight + rect.height))));

    aboutSection.style.transform = `translateY(${(1 - scrollProgress) * 8}px)`;
    aboutSection.style.opacity = `${0.9 + scrollProgress * 0.1}`;
  }

  ngOnDestroy(): void {
    if (this.scrollListener && this.isBrowser) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
