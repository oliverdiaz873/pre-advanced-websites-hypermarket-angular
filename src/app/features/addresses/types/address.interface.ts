/**
 * Tipos del contrato backend `/api/addresses` (E3).
 *
 * Shape canónico del backend Express+MongoDB (snapshot sin userId en el
 * `shippingAddress` de las órdenes). El cliente jamás inventa campos: solo
 * mapea el contrato.
 */

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  reference?: string;
  isDefault: boolean;
}

/** Payload para crear/editar una dirección (POST/PATCH /api/addresses). */
export interface AddressInput {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  reference?: string;
  isDefault?: boolean;
}

/** Snapshot de envío embebido en una orden (sin id/userId/isDefault). */
export interface ShippingAddressSnapshot {
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  reference?: string;
}
