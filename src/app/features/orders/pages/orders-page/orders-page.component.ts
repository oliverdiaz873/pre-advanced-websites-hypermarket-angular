import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderApiService } from '../../services/order-api.service';
import type { Order } from '../../types/order.interface';

/**
 * Historial de pedidos (E3). GET /api/orders es una lista plana (sin paginación
 * ficticia): se muestra orderNumber, fecha, estado, pago y subtotal, con acceso
 * al detalle. Estados loading / empty / error.
 */
@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
})
export class OrdersPageComponent {
  private readonly api = inject(OrderApiService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.list().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }
}
