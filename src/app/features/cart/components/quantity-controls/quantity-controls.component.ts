import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-controls.component.html',
  styleUrls: ['./quantity-controls.component.scss']
})
export class QuantityControlsComponent {
  @Input({ required: true }) quantity!: number;
  @Input({ required: true }) ariaLabels!: { decrease: string; increase: string };

  @Output() quantityChange = new EventEmitter<number>();

  onDecrease(): void {
    if (this.quantity > 1) {
      this.quantityChange.emit(this.quantity - 1);
    } else {
      this.quantityChange.emit(0);
    }
  }

  onIncrease(): void {
    this.quantityChange.emit(this.quantity + 1);
  }
}
