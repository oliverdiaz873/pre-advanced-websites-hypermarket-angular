import { Component, OnDestroy, signal, computed, inject, Signal } from '@angular/core';
import { getAssetUrl } from '@core/utils';
import { ViewportService } from '@core/services/viewport.service';

interface Banner {
  id: number;
  desktopImage: string;
  mobileImage: string;
  alt: string;
}

const BANNERS: Banner[] = [
  { id: 1, desktopImage: 'assets/images/banners/offers/fruits-and-vegetables.png', mobileImage: 'assets/images/banners/offers/fruits-and-vegetables-mobile.png', alt: 'Frutas y vegetales frescos en oferta' },
  { id: 2, desktopImage: 'assets/images/banners/offers/iphone.png', mobileImage: 'assets/images/banners/offers/iphone-mobile.png', alt: 'Tecnologia en oferta' },
  { id: 3, desktopImage: 'assets/images/banners/offers/wine.png', mobileImage: 'assets/images/banners/offers/wine-mobile.png', alt: 'Vinos seleccionados' },
];

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  template: `
    <section class="hero-carousel-section">
      <div
        class="hero-carousel-container relative overflow-hidden rounded-[20px] bg-neutral-900 w-full mx-auto mt-0"
        (touchstart)="handleTouchStart($event)"
        (touchmove)="handleTouchMove($event)"
        (touchend)="handleTouchEnd()"
        (mouseenter)="paused.set(true)"
        (mouseleave)="paused.set(false)"
      >
        <div
          class="hero-slides-wrapper flex transition-transform duration-700 ease-in-out h-full"
          [style.transform]="'translateX(-' + currentIndex() * 100 + '%)'"
        >
          @for (banner of banners; track banner.id) {
            <div class="banner w-full h-full flex-shrink-0">
              <img
                [src]="getAssetUrl(isMobile() ? banner.mobileImage : banner.desktopImage)"
                [alt]="banner.alt"
                class="w-full h-full object-cover select-none"
                draggable="false"
                [attr.fetchpriority]="banner.id === 1 ? 'high' : null"
              />
            </div>
          }
        </div>

        <button
          (click)="prevSlide()"
          class="hero-control-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 text-white rounded-full items-center justify-center hover:bg-black/70 transition-all hidden lg:flex"
          [class.opacity-0]="!showControls()"
          aria-label="Anterior"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          (click)="nextSlide()"
          class="hero-control-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 text-white rounded-full items-center justify-center hover:bg-black/70 transition-all hidden lg:flex"
          [class.opacity-0]="!showControls()"
          aria-label="Siguiente"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="hero-indicators absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 z-10 flex">
          @for (banner of banners; track banner.id; let i = $index) {
            <button
              (click)="goToSlide(i)"
              class="indicator-dot rounded-full transition-all duration-300"
              [class.is-active]="currentIndex() === i"
              [attr.aria-label]="'Ir a la imagen ' + (i + 1)"
            ></button>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-carousel-section {
      width: 100%;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .hero-carousel-section {
        padding: 0.5rem 0 2rem;
        max-width: 1400px;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .hero-carousel-container {
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      aspect-ratio: 3 / 1.1;
      min-height: 150px;
      max-width: 100%;
    }

    @media (min-width: 768px) {
      .hero-carousel-container {
        aspect-ratio: 3 / 1;
        min-height: 350px;
      }
    }

    @media (max-width: 640px) {
      .hero-carousel-container {
        border-radius: 12px;
        aspect-ratio: 16 / 9;
      }

      .hero-control-prev,
      .hero-control-next {
        width: 32px;
        height: 32px;
      }
    }

    .hero-slides-wrapper {
      will-change: transform;
      min-width: 0;
      width: 100%;
    }

    .banner img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      user-select: none;
      -webkit-user-drag: none;
    }

    .hero-carousel-container:hover .hero-control-prev,
    .hero-carousel-container:hover .hero-control-next {
      opacity: 1;
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      background: rgba(255,255,255,0.5);
    }

    .indicator-dot.is-active {
      background: white;
      transform: scale(1.25);
      width: 16px;
    }

    .indicator-dot:hover {
      background: rgba(255,255,255,0.8);
    }

    @media (max-width: 640px) {
      .indicator-dot {
        width: 6px;
        height: 6px;
      }

      .indicator-dot.is-active {
        width: 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-slides-wrapper {
        transition: none;
      }
    }
  `]
})
export class HeroCarouselComponent implements OnDestroy {
  protected readonly banners = BANNERS;
  protected readonly currentIndex = signal(0);
  protected readonly isMobile: Signal<boolean>;
  protected readonly showControls: Signal<boolean>;
  protected readonly paused = signal(false);
  protected readonly getAssetUrl = getAssetUrl;

  private readonly viewportService = inject(ViewportService);
  private touchStartX = 0;
  private touchEndX = 0;
  private autoSlideTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.isMobile = this.viewportService.isBelow(640);
    this.showControls = computed(() => !this.viewportService.isBelow(1024)());
    this.startAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideTimer = setInterval(() => {
      if (!this.paused()) {
        this.currentIndex.update(prev => prev === this.banners.length - 1 ? 0 : prev + 1);
      }
    }, 5000);
  }

  protected nextSlide(): void {
    this.currentIndex.update(prev => prev === this.banners.length - 1 ? 0 : prev + 1);
  }

  protected prevSlide(): void {
    this.currentIndex.update(prev => prev === 0 ? this.banners.length - 1 : prev - 1);
  }

  protected goToSlide(index: number): void {
    this.currentIndex.set(index);
  }

  protected handleTouchStart(event: TouchEvent): void {
    this.touchEndX = 0;
    this.touchStartX = event.touches[0].clientX;
  }

  protected handleTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  protected handleTouchEnd(): void {
    if (!this.touchStartX || !this.touchEndX) return;
    const distance = this.touchStartX - this.touchEndX;
    if (distance > 50) this.nextSlide();
    if (distance < -50) this.prevSlide();
  }

  ngOnDestroy(): void {
    if (this.autoSlideTimer) clearInterval(this.autoSlideTimer);
  }
}
