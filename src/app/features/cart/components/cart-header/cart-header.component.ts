import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../shared/components/icons/icons.component';

@Component({
  selector: 'app-cart-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe, IconComponent],
  templateUrl: './cart-header.component.html',
  styleUrl: './cart-header.component.scss'
})
export class CartHeaderComponent {
  @Input() count = 0;
}
