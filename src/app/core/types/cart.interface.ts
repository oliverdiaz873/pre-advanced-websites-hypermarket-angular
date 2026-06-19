export interface CartItem {
  productId: string;
  nombre: string;
  imagen: string;
  unitPrice: number;
  unitLabel: string;
  quantity: number;
  precioTexto?: string;
  oldPrice?: string;
}

export interface CartState {
  items: CartItem[];
}
