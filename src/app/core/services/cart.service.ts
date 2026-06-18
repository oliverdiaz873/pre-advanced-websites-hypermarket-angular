import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../types/product.interface';
import { CartItem } from '../types/cart.interface';
import { unitLabel } from '../utils/price-utils';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'carrito';
  private cartItems = signal<CartItem[]>([]);

  // Public read-only signal for items
  public items = this.cartItems.asReadonly();

  // Computed signals for derived state
  public totalItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  public totalPrice = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  );

  constructor() {
    this.rehydrate();

    // Automatically synchronize state to localStorage on any changes
    effect(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
      }
    });
  }

  /**
   * Adds a product to the cart. If it already exists, increments the quantity.
   */
  public addItem(product: Product, quantity: number = 1): void {
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
      } else {
        const newItem: CartItem = {
          productId: product.id,
          nombre: product.nombre,
          imagen: product.imagen,
          unitPrice: product.precio,
          unitLabel: unitLabel(product),
          quantity: quantity
        };
        return [...items, newItem];
      }
    });
  }

  /**
   * Removes an item completely from the cart.
   */
  public removeItem(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.productId !== productId));
  }

  /**
   * Updates the quantity of a specific item in the cart.
   * If quantity is <= 0, the item is removed.
   */
  public updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.cartItems.update(items => 
      items.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }

  /**
   * Empties the cart.
   */
  public clearCart(): void {
    this.cartItems.set([]);
  }

  /**
   * Rehydrates the cart state from localStorage.
   */
  private rehydrate(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as CartItem[];
          if (Array.isArray(parsed)) {
            this.cartItems.set(parsed);
          }
        }
      } catch (error) {
        console.error('Error rehydrating cart from localStorage:', error);
      }
    }
  }
}
