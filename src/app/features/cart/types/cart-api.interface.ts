/**
 * Tipos del contrato backend `/api/cart` (B2/N2).
 *
 * `ApiCartItem`/`ApiCart` es el `CartResponse` canónico que emite el servidor
 * Express+MongoDB. El cliente jamás recalcula cantidades/precios/ofertas: solo
 * transforma este snapshot al modelo visual `CartItem` (cart-mapper).
 * `CartMergeItem` es el payload del merge guest→server.
 */

export interface ApiCartItem {
  productId: string;
  name: string;
  price: number;
  unitPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  isOffer: boolean;
  quantity: number;
  image: string;
  unit?: string;
  unitQuantity?: number;
}

export interface ApiCart {
  items: ApiCartItem[];
  totalItems: number;
  subtotal: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload de merge guest→server: SOLO ids y cantidades, nunca precios locales. */
export interface CartMergeItem {
  productId: string;
  quantity: number;
}