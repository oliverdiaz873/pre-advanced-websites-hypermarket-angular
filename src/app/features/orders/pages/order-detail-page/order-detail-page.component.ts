import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '@shared/components/toast/toast.service';
import { resolveProductImageUrl } from '@core/api/product-image.resolver';
import { OrderApiService } from '../../services/order-api.service';
import type { Order } from '../../types/order.interface';

/**
 * Detalle de pedido (E3). Muestra orderNumber, fecha, items, dirección de envío,
 * estados e historial. Pay solo con `paymentStatus === 'pending'`; cancel solo con
 * `status === 'pending' | 'confirmed'`. Tras cada mutación se RECONSULTA el estado
 * desde el backend (server-wins) para evitar estado local desincronizado.
 */
@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './order-detail-page.component.html',
  styleUrl: './order-detail-page.component.scss',
})
export class OrderDetailPageComponent {
  private readonly api = inject(OrderApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly isPaying = signal(false);
  readonly isCancelling = signal(false);

  readonly canPay = computed(() => this.order()?.paymentStatus === 'pending');
  readonly canCancel = computed(() => {
    const status = this.order()?.status;
    return status === 'pending' || status === 'confirmed';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  load(id: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(true);
        if (error.status === 404) {
          this.toast.error(this.translate.instant('orders.errors.not_found'));
        }
      },
    });
  }

  /** POST /api/orders/:id/pay — solo si paymentStatus === 'pending'. */
  onPay(): void {
    const order = this.order();
    if (!order || !this.canPay() || this.isPaying()) return;

    this.isPaying.set(true);
    this.api.pay(order.id).subscribe({
      next: () => {
        this.isPaying.set(false);
        this.refresh(order.id);
      },
      error: (error: HttpErrorResponse) => {
        this.isPaying.set(false);
        this.handleMutationError(error, 'orders.errors.cannot_pay');
      },
    });
  }

  /** PATCH /api/orders/:id/status { status: 'cancelled' }. */
  onCancel(): void {
    const order = this.order();
    if (!order || !this.canCancel() || this.isCancelling()) return;

    this.isCancelling.set(true);
    this.api.cancel(order.id).subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.refresh(order.id);
      },
      error: (error: HttpErrorResponse) => {
        this.isCancelling.set(false);
        this.handleMutationError(error, 'orders.errors.cannot_cancel');
      },
    });
  }

  private refresh(id: string): void {
    this.api.getById(id).subscribe({
      next: (order) => this.order.set(order),
      error: () => this.toast.error(this.translate.instant('orders.errors.generic')),
    });
  }

  private handleMutationError(error: HttpErrorResponse, invalidKey: string): void {
    if (error.status === 401) {
      this.toast.error(this.translate.instant('orders.errors.unauthenticated'));
      return;
    }
    if (error.status === 400) {
      this.toast.error(this.translate.instant(invalidKey));
      return;
    }
    this.toast.error(this.translate.instant('orders.errors.generic'));
  }

  resolveImage(image: string): string | null {
    return resolveProductImageUrl(image);
  }

  getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }
}
