import { Product } from '@core/types/product.interface';
import { offersData } from '@data/offers.data';

export interface ProductOffer {
  oldPrice: string;
}

/**
 * Resolves whether a product has an active offer by looking it up
 * in the offers data source. Returns the old price if found, or null.
 */
export function resolveProductOffer(product: Product): ProductOffer | null {
  const offer = offersData.find(o => o.id === product.id);
  return offer ? { oldPrice: offer.oldPrice } : null;
}
