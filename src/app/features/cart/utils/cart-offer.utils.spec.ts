import { Product } from '@core/types/product.interface';
import { resolveProductOffer } from './cart-offer.utils';

describe('resolveProductOffer', () => {
  const normalProduct: Product = {
    id: 'prod-1',
    nombre: 'Leche Deslactosada',
    url: '/leche-deslactosada',
    categoria: 'lacteos',
    precio: 1500,
    precioTexto: 'Precio: $1.500 / litro',
    imagen: 'leche.jpg',
    unidad: 'litro'
  };

  const offerProduct: Product = {
    id: 'manzanas_verdes',
    nombre: 'Manzanas Verdes',
    url: '/manzanas-verdes',
    categoria: 'frutas',
    precio: 45,
    precioTexto: '$45 / lb',
    imagen: 'manzanas.jpg',
    unidad: 'lb'
  };

  it('should return null for a product without an offer', () => {
    const result = resolveProductOffer(normalProduct);
    expect(result).toBeNull();
  });

  it('should return oldPrice for a product that has an offer', () => {
    const result = resolveProductOffer(offerProduct);
    expect(result).not.toBeNull();
    expect(result!.oldPrice).toBe('RD$ 56.25');
  });

  it('should return null for a non-existent product id', () => {
    const unknownProduct: Product = {
      id: 'non-existent-id',
      nombre: 'Unknown',
      url: '/unknown',
      categoria: 'test',
      precio: 100,
      precioTexto: '$100',
      imagen: 'unknown.jpg'
    };
    const result = resolveProductOffer(unknownProduct);
    expect(result).toBeNull();
  });
});
