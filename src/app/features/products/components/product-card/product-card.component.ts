import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductUI } from '../../models/product-ui.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: ProductUI;
  @Input() oldPrice?: string;
  @Input() badgeText?: string;
  @Input() actionText?: string;

  @Output() actionClick = new EventEmitter<ProductUI>();

  get isOffer(): boolean {
    return !!this.oldPrice;
  }

  getFormattedPrice(): string {
    if (!this.product) return '';
    return `$${this.product.precio.toLocaleString()}`;
  }

  cleanPrice(text: string): string {
    if (!text) return '';
    const cleaned = text.replace(/^[a-z]+:\s*/i, '').trim();
    const match = cleaned.match(/(\$?\d+(?:,\d+)?(?:\.\d+)?)/);
    return match ? match[1] : cleaned;
  }

  getAssetUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (!normalizedPath.startsWith('/assets/')) {
      normalizedPath = `/assets${normalizedPath}`;
    }
    return normalizedPath;
  }

  getUnitLabel(): string {
    if (this.product.unidad) return this.product.unidad;
    if (this.product.precioTexto) {
      const parts = this.product.precioTexto.split('/');
      if (parts.length > 1) {
        return parts[parts.length - 1].trim().replace(/\.$/, '');
      }
    }
    return 'unidad';
  }

  onActionClick(event: Event): void {
    event.stopPropagation();
    this.actionClick.emit(this.product);
  }
}
