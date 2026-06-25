import { Product } from '@core/types/product.interface';
import { productById } from '@data/catalog.helpers';
import { offersData, type OfferData } from '@features/offers/data/offers.data';
import { ProductUI } from '@features/products/models/product-ui.interface';

export interface ProductOffer {
  oldPrice: string;
}

export function resolveProductOffer(product: Product, offers: OfferData[] = offersData): ProductOffer | null {
  const offer = offers.find(o => o.id === product.id);
  return offer ? { oldPrice: offer.oldPrice } : null;
}

const parseOfferPrice = (price: string): number => {
  const normalizedPrice = price.replace(/[^\d.]/g, '');
  return Number.parseFloat(normalizedPrice);
};

export const calculateDiscountPercentage = (currentPrice: number, oldPrice: string): number => {
  const previousPrice = parseOfferPrice(oldPrice);

  if (!Number.isFinite(previousPrice) || previousPrice <= currentPrice) {
    return 0;
  }

  return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
};

export const offerProducts = (): ProductUI[] => offersData
  .map(offer => {
    const product = productById(offer.id);
    if (!product) return undefined;
    const discount = calculateDiscountPercentage(product.precio, offer.oldPrice);
    return {
      ...product,
      oldPrice: offer.oldPrice,
      badgeText: discount > 0 ? `-${discount}%` : 'Oferta'
    } satisfies ProductUI;
  })
  .filter(Boolean) as ProductUI[];
