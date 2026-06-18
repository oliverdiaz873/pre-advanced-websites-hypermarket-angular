import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-controls.component.html',
  styleUrl: './quantity-controls.component.scss'
})
export class QuantityControlsComponent {
  @Input() quantity = 1;
  @Input() unitLabel = 'unidad';

  @Output() quantityChange = new EventEmitter<number>();

  public onDecrease(): void {
    if (this.quantity > 1) {
      this.quantityChange.emit(this.quantity - 1);
    } else {
      // If quantity is 1 and they decrease, it can mean removing from cart
      this.quantityChange.emit(0);
    }
  }

  public onIncrease(): void {
    this.quantityChange.emit(this.quantity + 1);
  }

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value) && value >= 0) {
      this.quantityChange.emit(value);
    } else {
      // Revert input value to current quantity
      input.value = this.quantity.toString();
    }
  }
}
