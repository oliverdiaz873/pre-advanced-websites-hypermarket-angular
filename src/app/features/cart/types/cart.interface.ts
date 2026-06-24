/**
 * Represents a single item in the shopping cart.
 * Mirrors the CartItem interface from Next.js (CartContext.tsx)
 * with renamed fields to match Angular conventions.
 */
export interface CartItem {
  productId: string;
  nombre: string;
  imagen: string;
  unitPrice: number;
  unitLabel: string;
  quantity: number;
  precioTexto?: string;
  oldPrice?: string;
  unidad?: string;
  isOffer?: boolean;
  discountPercentage?: number;
}

export interface CartState {
  items: CartItem[];
}
