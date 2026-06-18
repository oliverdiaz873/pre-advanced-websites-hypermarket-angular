export interface CartItem {
  productId: string;
  nombre: string;
  imagen: string;
  unitPrice: number;     // Clean numeric price
  unitLabel: string;     // Clean unit label (e.g. 'kg', 'unidad')
  quantity: number;      // Current quantity in cart
}

export interface CartState {
  items: CartItem[];
}
