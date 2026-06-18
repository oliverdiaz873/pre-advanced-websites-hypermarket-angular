import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../types/product.interface';
import { CartItem } from '../types/cart.interface';

describe('CartService', () => {
  let service: CartService;
  
  const mockProduct: Product = {
    id: 'prod-1',
    nombre: 'Leche Deslactosada',
    url: '/leche-deslactosada',
    categoria: 'lacteos',
    precio: 1500,
    precioTexto: 'Precio: $1.500 / litro',
    imagen: 'leche.jpg',
    unidad: 'litro'
  };

  const mockProduct2: Product = {
    id: 'prod-2',
    nombre: 'Arroz Integral',
    url: '/arroz-integral',
    categoria: 'despensa',
    precio: 2200,
    precioTexto: '$2.200 / kg.',
    imagen: 'arroz.jpg',
    unidad: 'kg'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('should add a product to the cart', () => {
    service.addItem(mockProduct, 2);
    
    const items = service.items();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual({
      productId: 'prod-1',
      nombre: 'Leche Deslactosada',
      imagen: 'leche.jpg',
      unitPrice: 1500,
      unitLabel: 'litro',
      quantity: 2
    });
    
    expect(service.totalItems()).toBe(2);
    expect(service.totalPrice()).toBe(3000);
  });

  it('should increment quantity if product already exists in cart', () => {
    service.addItem(mockProduct, 1);
    service.addItem(mockProduct, 2);
    
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(3);
    expect(service.totalItems()).toBe(3);
    expect(service.totalPrice()).toBe(4500);
  });

  it('should update item quantity', () => {
    service.addItem(mockProduct, 1);
    service.updateQuantity('prod-1', 5);
    
    expect(service.items()[0].quantity).toBe(5);
    expect(service.totalItems()).toBe(5);
    expect(service.totalPrice()).toBe(7500);
  });

  it('should remove item if quantity is set to 0 or less', () => {
    service.addItem(mockProduct, 2);
    service.updateQuantity('prod-1', 0);
    
    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
  });

  it('should remove item completely', () => {
    service.addItem(mockProduct, 1);
    service.addItem(mockProduct2, 3);
    
    service.removeItem('prod-1');
    
    expect(service.items().length).toBe(1);
    expect(service.items()[0].productId).toBe('prod-2');
    expect(service.totalItems()).toBe(3);
    expect(service.totalPrice()).toBe(6600);
  });

  it('should clear the cart', () => {
    service.addItem(mockProduct, 2);
    service.addItem(mockProduct2, 1);
    
    service.clearCart();
    
    expect(service.items()).toEqual([]);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });
});
