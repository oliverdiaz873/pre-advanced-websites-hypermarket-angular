import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-cart.component.html',
  styleUrl: './empty-cart.component.scss'
})
export class EmptyCartComponent {
  @Output() browseProducts = new EventEmitter<void>();

  public onBrowse(): void {
    this.browseProducts.emit();
  }
}
