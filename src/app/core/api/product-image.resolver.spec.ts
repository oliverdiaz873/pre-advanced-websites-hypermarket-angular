import { describe, it, expect } from 'vitest';
import { resolveProductImageUrl } from './product-image.resolver';

describe('resolveProductImageUrl', () => {
  it('usa tal cual las URLs absolutas', () => {
    expect(resolveProductImageUrl('https://cdn.example.com/products/a.webp?v=2026-01-01T00:00:00.000Z')).toBe(
      'https://cdn.example.com/products/a.webp?v=2026-01-01T00:00:00.000Z'
    );
    expect(resolveProductImageUrl('http://localhost:3000/uploads/x.avif', 'http://localhost:3000')).toBe(
      'http://localhost:3000/uploads/x.avif'
    );
    expect(resolveProductImageUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
  });

  it('resuelve una key relativa legacy contra la base pública', () => {
    expect(resolveProductImageUrl('products/bebidas/coca-cola.avif', 'http://localhost:3000')).toBe(
      'http://localhost:3000/uploads/products/bebidas/coca-cola.avif'
    );
  });

  it('normaliza una key con slash inicial', () => {
    expect(resolveProductImageUrl('/products/bebidas/coca-cola.avif', 'https://cdn.hipermercadosuperior.com')).toBe(
      'https://cdn.hipermercadosuperior.com/uploads/products/bebidas/coca-cola.avif'
    );
  });

  it('devuelve null si no hay imagen', () => {
    expect(resolveProductImageUrl(null)).toBeNull();
    expect(resolveProductImageUrl(undefined)).toBeNull();
    expect(resolveProductImageUrl('')).toBeNull();
  });
});