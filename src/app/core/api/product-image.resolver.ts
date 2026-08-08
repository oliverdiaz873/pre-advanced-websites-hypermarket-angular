import { getStoragePublicUrl } from './api.config';

/**
 * Resuelve la URL pública de una imagen de producto (decisión F5.0).
 *
 * Regla:
 * - Si `image` ya es una URL absoluta (http/https/data:) se usa tal cual.
 * - Si es una key relativa legacy de la seed (ej. `products/bebidas/coca-cola.avif`
 *   sin `imageKey`), se convierte con la base pública de storage del frontend:
 *   dev → `${storagePublicUrl}/uploads/<key>`, prod → base CDN/R2.
 * - `?v=` se mantiene si viene en la respuesta; el cliente NUNCA genera versiones.
 */
export const resolveProductImageUrl = (
  image: string | null | undefined,
  storagePublicUrl = getStoragePublicUrl()
): string | null => {
  if (!image) return null;

  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image;
  }

  const raw = image.startsWith('/') ? image.slice(1) : image;
  return `${storagePublicUrl}/uploads/${raw}`;
};