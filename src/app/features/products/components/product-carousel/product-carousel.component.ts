import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  signal,
  AfterViewInit,
  OnDestroy,
  inject,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

/**
 * ProductCarousel - Technical carousel engine.
 * Handles only scroll logic, navigation buttons, and container layout.
 * Content-agnostic (receives products as input).
 * Difference from ProductCarouselSection: This is just the "mechanism",
 * while the Section adds title, background, and data mapping.
 */
@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProductCardComponent],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselComponent implements AfterViewInit, OnDestroy {
  @Input() products: ProductUI[] = [];
  @Input() idPrefix = '';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  readonly showPrev = signal(false);
  readonly showNext = signal(false);

  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    this.updateButtons();
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      const handler = () => this.updateButtons();
      el.addEventListener('scroll', handler);
      this.scrollListener = () => el.removeEventListener('scroll', handler);
    }
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.updateButtons(), 150);
    };
    window.addEventListener('resize', debouncedResize);
    this.resizeListener = () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }

  ngOnDestroy(): void {
    this.scrollListener?.();
    this.resizeListener?.();
  }

  private updateButtons(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    this.showPrev.set(el.scrollLeft > 30);
    this.showNext.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }

  scrollLeft(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollRight(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  trackById(_: number, product: ProductUI): string {
    return product.id;
  }
}
