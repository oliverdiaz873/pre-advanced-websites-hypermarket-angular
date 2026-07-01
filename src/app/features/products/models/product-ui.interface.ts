import { Product } from '@core/types/product.interface';

export interface ProductUI extends Product {
    oldPrice?: string;
    discountPercentage?: number;
}
