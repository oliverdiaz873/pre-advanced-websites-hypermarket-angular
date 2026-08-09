import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Product } from '@core/types/product.interface';
import { CartItem } from '../types/cart.interface';
import { unitLabel } from '@core/utils/price-utils';
import { ProductUI } from '@features/products/models/product-ui.interface';
import { StorageService } from '@core/services/storage.service';

const parsePriceNumber = (text: string): number =>
  Number.parseFloat(text.replace(/[^\d.]/g, ''));

const discountFromPrices = (currentPrice: number, oldPrice: string): number => {
  const previous = parsePriceNumber(oldPrice);
  if (!Number.isFinite(previous) || previous <= currentPrice) return 0;
  return Math.round(((previous - currentPrice) / previous) * 100);
};

/**
 * Global cart state management service.
 *
 * Handles the shopping cart state using Angular Signals, with automatic
 * persistence to localStorage under the key 'carrito'. Provides actions
 * to add, remove, update quantity, and clear items.
 *
 * Discount calculation delegates to the offers feature for pricing rules.
 *
 * Functional equivalent of Next.js CartContext + useCart hook.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'carrito';
  private storage = inject(StorageService);
  private cartItems = signal<CartItem[]>([]);

  /** Public read-only signal for cart items */
  public items = this.cartItems.asReadonly();

  /** Total number of items across all cart entries */
  public totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  /** Total price computed from unitPrice * quantity */
  public totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  );

  constructor() {
    this.rehydrate();

    effect(() => {
      this.storage.set<CartItem[]>(this.STORAGE_KEY, this.cartItems());
    });
  }

  /**
   * Adds a product to the cart. If it already exists, increments the quantity.
   * When oldPrice is provided, calculates discount percentage and marks the
   * item as an offer. The discount data becomes part of the CartItem and
   * does not depend on any external lookup at rehydration time.
   */
  public addItem(product: Product, quantity = 1, oldPrice?: string): void {
    if (quantity <= 0) return;

    this.cartItems.update(items => {
      const existingIndex = items.findIndex(item => item.productId === product.id);

      if (existingIndex > -1) {
        const updatedItems = [...items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity
        };
        return updatedItems;
      }

      const finalUnidad = this.extractUnidad(product);
      const backendDiscount = (product as ProductUI).discountPercentage ?? 0;
      const discountPercentage = backendDiscount > 0
        ? backendDiscount
        : (oldPrice ? discountFromPrices(product.precio, oldPrice) : 0);

      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        imagen: product.imagen,
        unitPrice: product.precio,
        unitLabel: unitLabel(product),
        quantity,
        precioTexto: product.precioTexto,
        oldPrice,
        unidad: finalUnidad,
        isOffer: discountPercentage > 0,
        discountPercentage,
        unitQuantity: product.quantity
      };
      return [...items, newItem];
    });
  }

  /** Removes an item completely from the cart by product ID */
  public removeItem(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.productId !== productId));
  }

  /**
   * Updates the quantity of a specific item by applying a delta.
   * If the resulting quantity is 0 or less, the item is removed.
   */
  public updateQuantity(productId: string, delta: number): void {
    this.cartItems.update(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + delta }
          : item
      ).filter(item => item.quantity > 0)
    );
  }

  /** Empties the entire cart */
  public clearCart(): void {
    this.cartItems.set([]);
  }

  /**
   * Restores cart state from localStorage and normalizes fields
   * to ensure backward compatibility with persisted data.
   */
  private rehydrate(): void {
    try {
      const stored = this.storage.get<CartItem[]>(this.STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        const normalized = stored.map(item => {
          const discountPct = item.oldPrice ? discountFromPrices(item.unitPrice, item.oldPrice) : 0;
          return {
            ...item,
            unitLabel: item.unitLabel ?? unitLabel({ unidad: item.unidad, precioTexto: item.precioTexto } as Product),
            discountPercentage: discountPct,
            isOffer: discountPct > 0,
            unidad: item.unidad ?? undefined,
            unitQuantity: item.unitQuantity ?? undefined
          };
        });
        this.cartItems.set(normalized);
      }
    } catch (error) {
      console.error('Error rehydrating cart from localStorage:', error);
    }
  }

  /**
   * Extracts the unit label from a product.
   * Priority: explicit unidad field > text after "/" in precioTexto > undefined.
   */
  private extractUnidad(product: Product): string | undefined {
    if (product.unidad) return product.unidad;
    if (product.precioTexto) {
      const parts = product.precioTexto.split('/');
      if (parts.length > 1) {
        return parts[parts.length - 1].trim().replace(/\.$/, '');
      }
    }
    return undefined;
  }


}
