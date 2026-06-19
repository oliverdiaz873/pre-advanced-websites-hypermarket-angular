import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUI } from '../../models/product-ui.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselComponent {
  @Input() products: ProductUI[] = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  private readonly SCROLL_AMOUNT = 320; // px per click

  public scrollLeft(): void {
    this.scrollContainer?.nativeElement.scrollBy({
      left: -this.SCROLL_AMOUNT,
      behavior: 'smooth'
    });
  }

  public scrollRight(): void {
    this.scrollContainer?.nativeElement.scrollBy({
      left: this.SCROLL_AMOUNT,
      behavior: 'smooth'
    });
  }

  public trackById(_: number, product: ProductUI): string {
    return product.id;
  }
}
