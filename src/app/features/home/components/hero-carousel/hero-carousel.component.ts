import { Component, OnDestroy, signal, computed, inject, Signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { getAssetUrl } from '@core/utils';
import { IconComponent } from '@shared/components/icons/icons.component';
import { ViewportService } from '@core/services/viewport.service';

/**
 * Datos de cada banner del carrusel.
 * Cada banner tiene una versión desktop y mobile, más una clave de traducción para el alt.
 */
interface Banner {
  id: number;
  desktopImage: string;
  mobileImage: string;
  altKey: string;
}

const BANNERS: Banner[] = [
  { id: 1, desktopImage: 'assets/images/banners/offers/fruits-and-vegetables.png', mobileImage: 'assets/images/banners/offers/fruits-and-vegetables-mobile.png', altKey: 'home.hero.alt_fruits' },
  { id: 2, desktopImage: 'assets/images/banners/offers/iphone.png', mobileImage: 'assets/images/banners/offers/iphone-mobile.png', altKey: 'home.hero.alt_tech' },
  { id: 3, desktopImage: 'assets/images/banners/offers/wine.png', mobileImage: 'assets/images/banners/offers/wine-mobile.png', altKey: 'home.hero.alt_wine' },
];

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [TranslatePipe, IconComponent],
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.scss']
})
export class HeroCarouselComponent implements OnDestroy {
  /** Lista estática de banners del carrusel. */
  protected readonly banners = BANNERS;
  /** Índice del slide actualmente visible. */
  protected readonly currentIndex = signal(0);
  /** Indica si la ventana es menor a 640px (selecciona imagen mobile vs desktop). */
  protected readonly isMobile: Signal<boolean>;
  /** Controla la visibilidad de los botones prev/next (solo en desktop ≥1024px). */
  protected readonly showControls: Signal<boolean>;
  /** Utilidad que resuelve rutas de assets. */
  protected readonly getAssetUrl = getAssetUrl;

  private readonly viewportService = inject(ViewportService);
  private touchStartX = 0;
  private touchEndX = 0;
  private autoSlideTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Detectar si es mobile con matchMedia (breakpoint 640px)
    this.isMobile = this.viewportService.isBelow(640);
    // Los controles prev/next solo se muestran en desktop (≥1024px)
    this.showControls = computed(() => !this.viewportService.isBelow(1024)());
    this.startAutoSlide();
  }

  /** Inicia el avance automático cada 5 segundos. */
  private startAutoSlide(): void {
    this.autoSlideTimer = setInterval(() => {
      this.currentIndex.update(prev => prev === this.banners.length - 1 ? 0 : prev + 1);
    }, 5000);
  }

  /** Avanza al siguiente slide. */
  protected nextSlide(): void {
    this.currentIndex.update(prev => prev === this.banners.length - 1 ? 0 : prev + 1);
  }

  /** Retrocede al slide anterior. */
  protected prevSlide(): void {
    this.currentIndex.update(prev => prev === 0 ? this.banners.length - 1 : prev - 1);
  }

  /** Navega directamente a un slide específico (usado por los indicadores). */
  protected goToSlide(index: number): void {
    this.currentIndex.set(index);
  }

  /** Captura la coordenX inicial del toque para detectar swipe. */
  protected handleTouchStart(event: TouchEvent): void {
    this.touchEndX = 0;
    this.touchStartX = event.touches[0].clientX;
  }

  /** Actualiza la coordenada X durante el arrastre táctil. */
  protected handleTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  /** Si la distancia del swipe supera 50px, navega al slide correspondiente. */
  protected handleTouchEnd(): void {
    if (!this.touchStartX || !this.touchEndX) return;
    const distance = this.touchStartX - this.touchEndX;
    if (distance > 50) this.nextSlide();
    if (distance < -50) this.prevSlide();
  }

  /** Limpia el intervalo de auto-slide al destruir el componente. */
  ngOnDestroy(): void {
    if (this.autoSlideTimer) clearInterval(this.autoSlideTimer);
  }
}
