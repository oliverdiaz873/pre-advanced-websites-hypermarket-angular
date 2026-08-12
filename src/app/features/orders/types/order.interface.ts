/**
 * Tipos del contrato backend `/api/orders` (E3).
 *
 * Shape canónico del backend (POST checkout, GET listado, GET by id, POST pay,
 * PATCH status). Los precios/stock/estados son autoridad del backend; este
 * consumidor solo mapea el contrato.
 */
import type { ShippingAddressSnapshot } from '../../addresses/types/address.interface';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/** Línea de una orden (snapshot del carrito al checkout). */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  unit?: string;
  unitQuantity?: number;
  quantity: number;
}

/** Entrada del historial de estados. */
export interface StatusHistoryEntry {
  status: OrderStatus;
  changedAt: string;
  by?: string;
  note?: string;
}

/** Orden completa (respuesta del backend). */
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  idempotencyKey?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddressSnapshot;
  totalItems: number;
  subtotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

/** Payload del checkout (POST /orders). */
export interface CreateOrderInput {
  addressId: string;
  idempotencyKey: string;
}
