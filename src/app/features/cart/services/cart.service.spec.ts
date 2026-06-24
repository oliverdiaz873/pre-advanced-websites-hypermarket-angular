import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '@core/types/product.interface';
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
      quantity: 2,
      precioTexto: 'Precio: $1.500 / litro',
      oldPrice: undefined,
      unidad: 'litro',
      isOffer: false,
      discountPercentage: 0
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

  it('should update item quantity by delta', () => {
    service.addItem(mockProduct, 1);
    service.updateQuantity('prod-1', 5);
    
    expect(service.items()[0].quantity).toBe(6);
    expect(service.totalItems()).toBe(6);
    expect(service.totalPrice()).toBe(9000);
  });

  it('should remove item if quantity drops to 0 or less after delta', () => {
    service.addItem(mockProduct, 2);
    service.updateQuantity('prod-1', -2);
    
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

  it('should calculate discount percentage when oldPrice is provided', () => {
    service.addItem(mockProduct, 1, 'RD$ 2,000');

    const items = service.items();
    expect(items[0].isOffer).toBe(true);
    expect(items[0].discountPercentage).toBe(25);
    expect(items[0].oldPrice).toBe('RD$ 2,000');
  });

  it('should not mark as offer when oldPrice is equal to current price', () => {
    service.addItem(mockProduct, 1, 'RD$ 1,500');

    expect(service.items()[0].isOffer).toBe(false);
    expect(service.items()[0].discountPercentage).toBe(0);
  });

  it('should not mark product as offer when no discount applies', () => {
    service.addItem(mockProduct, 1);

    expect(service.items()[0].isOffer).toBe(false);
    expect(service.items()[0].discountPercentage).toBe(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should persist items to localStorage when cart changes', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    service.addItem(mockProduct, 1);
    TestBed.flushEffects();

    const lastCall = setItemSpy.mock.calls.at(-1);
    expect(lastCall?.[0]).toBe('carrito');
    expect(lastCall?.[1]).toContain('"productId":"prod-1"');
  });

  it('should rehydrate and normalize legacy data from localStorage', () => {
    const legacyData = JSON.stringify([{
      productId: 'prod-1',
      nombre: 'Leche Deslactosada',
      imagen: 'leche.jpg',
      unitPrice: 1500,
      unitLabel: null,
      quantity: 2,
      precioTexto: 'Precio: $1.500 / litro'
    }, {
      productId: 'prod-2',
      nombre: 'Arroz Integral',
      imagen: 'arroz.jpg',
      unitPrice: 2200,
      unitLabel: null,
      quantity: 1,
      precioTexto: '$2.200 / kg.',
      oldPrice: 'RD$ 3,000'
    }, {
      productId: 'prod-3',
      nombre: 'Manzanas',
      imagen: 'manzanas.jpg',
      unitPrice: 45,
      unitLabel: 'lb',
      quantity: 1,
      precioTexto: '$45 / lb',
      oldPrice: 'RD$ 56.25',
      isOffer: false,
      discountPercentage: 0
    }]);

    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(legacyData);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [CartService] });
    const freshService = TestBed.inject(CartService);

    expect(freshService.items().length).toBe(3);
    // Normal product: no offer
    expect(freshService.items()[0].unitLabel).toBe('litro');
    expect(freshService.items()[0].isOffer).toBe(false);
    expect(freshService.items()[0].discountPercentage).toBe(0);
    expect(freshService.items()[0].unidad).toBeUndefined();
    // Product with oldPrice: discount derived from own data
    expect(freshService.items()[1].isOffer).toBe(true);
    expect(freshService.items()[1].discountPercentage).toBe(27);
    expect(freshService.items()[1].oldPrice).toBe('RD$ 3,000');
    // Legacy item with stale isOffer:false + oldPrice: must be corrected
    expect(freshService.items()[2].isOffer).toBe(true);
    expect(freshService.items()[2].discountPercentage).toBe(20);
    expect(freshService.items()[2].oldPrice).toBe('RD$ 56.25');
  });

  it('should compute totalPrice correctly with mixed items', () => {
    service.addItem(mockProduct, 2);
    service.addItem(mockProduct, 3, 'RD$ 2,000');

    expect(service.totalItems()).toBe(5);
    expect(service.totalPrice()).toBe(7500);
  });
});
