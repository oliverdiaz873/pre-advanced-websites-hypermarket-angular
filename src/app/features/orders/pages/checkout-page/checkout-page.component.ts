import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '@features/cart/services/cart.service';
import { ToastService } from '@shared/components/toast/toast.service';
import { AddressApiService } from '@features/addresses/services/address-api.service';
import { AddressListComponent } from '@features/addresses/components/address-list/address-list.component';
import { AddressFormComponent } from '@features/addresses/components/address-form/address-form.component';
import { OrderApiService } from '../../services/order-api.service';
import type { Address, AddressInput } from '@features/addresses/types/address.interface';

/**
 * Checkout de una sola página (E3).
 *
 * DIFERENCIA RESPECTO A NEXT.JS (E3-N): allí la `idempotencyKey` se genera
 * server-side en la RSC; Angular NO tiene RSC/Server Actions, por lo que la key
 * se genera en el cliente con `crypto.randomUUID()` UNA SOLA VEZ al montar el
 * componente y se conserva durante todo ese intento de checkout. Cualquier
 * reintento (timeout, error de red, 409 de stock) reutiliza EXACTAMENTE la misma
 * key, de modo que el backend (unique {userId, idempotencyKey}) nunca crea una
 * segunda orden. Nunca se genera una key nueva tras un error.
 *
 * El backend ya vacía el carrito tras crear la orden; este cliente NO ejecuta
 * ninguna operación de limpieza adicional (server-wins).
 */
@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterLink, AddressListComponent, AddressFormComponent, TranslatePipe],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  private readonly api = inject(OrderApiService);
  private readonly addressApi = inject(AddressApiService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  /** Key generada una sola vez al entrar a /checkout; estable en todo el intento. */
  readonly idempotencyKey: string = CheckoutPageComponent.generateIdempotencyKey();

  readonly addresses = signal<Address[]>([]);
  readonly loadingAddresses = signal(true);
  readonly addressesError = signal(false);
  readonly selectedAddressId = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly cartItems = this.cartService.items;
  readonly totalItems = this.cartService.totalItems;
  readonly subtotal = this.cartService.totalPrice;

  readonly isCartEmpty = computed(() => this.totalItems() === 0);

  ngOnInit(): void {
    this.loadAddresses();
  }

  /** GET /api/addresses — direcciones del usuario para seleccionar/crear inline. */
  loadAddresses(): void {
    this.loadingAddresses.set(true);
    this.addressesError.set(false);
    this.addressApi.list().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        this.loadingAddresses.set(false);
        if (addresses.length > 0 && !this.selectedAddressId()) {
          const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
          this.selectedAddressId.set(preferred.id);
        }
      },
      error: () => {
        this.loadingAddresses.set(false);
        this.addressesError.set(true);
      },
    });
  }

  openForm(): void {
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  /** Creación inline de dirección dentro del checkout. */
  onAddressSubmitted(input: AddressInput): void {
    this.addressApi.create(input).subscribe({
      next: (created) => {
        this.showForm.set(false);
        this.loadAddresses();
        this.selectedAddressId.set(created.id);
      },
      error: () => this.toast.error(this.translate.instant('addresses.errors.generic')),
    });
  }

  /** POST /api/orders { addressId, idempotencyKey } — el retry reutiliza la misma key. */
  confirmOrder(): void {
    if (this.submitting()) return;

    if (this.isCartEmpty()) {
      this.submitError.set(this.translate.instant('checkout.errors.cart_empty'));
      return;
    }

    const addressId = this.selectedAddressId();
    if (!addressId) {
      this.submitError.set(this.translate.instant('checkout.errors.no_address'));
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.api.create({ addressId, idempotencyKey: this.idempotencyKey }).subscribe({
      next: (order) => {
        this.submitting.set(false);
        void this.router.navigate(['/orders', order.id]);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.mapCreateError(error);
      },
    });
  }

  private mapCreateError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        void this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
        break;
      case 400:
        this.submitError.set(this.translate.instant('checkout.errors.cart_empty'));
        break;
      case 404:
        this.submitError.set(this.translate.instant('checkout.errors.address_not_found'));
        break;
      case 409:
        this.submitError.set(this.translate.instant('checkout.errors.insufficient_stock'));
        break;
      default:
        this.submitError.set(this.translate.instant('checkout.errors.generic'));
    }
  }

  private static generateIdempotencyKey(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  getFormattedPrice(price: number): string {
    return `$${price.toLocaleString()}`;
  }
}
