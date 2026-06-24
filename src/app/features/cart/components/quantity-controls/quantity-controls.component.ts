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

  @Output() decrease = new EventEmitter<void>();
  @Output() increase = new EventEmitter<void>();

  onDecrease(): void {
    this.decrease.emit();
  }

  onIncrease(): void {
    this.increase.emit();
  }
}
