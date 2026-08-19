/**
 * Tipos del contrato backend (F5). Reflejan API-CONTRACT §5-§8 tal como emite
 * el backend Express+MongoDB. No son la interface UI (ver mappers F5.2).
 */

export interface ApiCollection<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  image: string | null;
  categoryId: string;
  subcategoryId?: string | null;
  category: { name: string; slug: string };
  subcategory?: { name: string; slug: string } | null;
  brandId?: string;
  brand?: { name: string; slug: string };
  unit?: string;
  unitQuantity?: number;
  status: 'active' | 'inactive';
  isAvailable: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSubcategory {
  name: string;
  slug: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  subcategories: ApiSubcategory[];
}

export interface ApiOffer {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  image: string | null;
  categoryId: string;
  unit?: string;
  unitQuantity?: number;
}

/** Contrato E4.5: mensaje de contacto tal y como lo devuelve POST /api/contact. */
export interface ApiContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'read' | 'answered';
  createdAt: string;
  updatedAt: string;
}

/** Cuerpo de POST /api/contact. */
export interface ApiContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ApiPaginationParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  categoryId?: string;
  subcategoryId?: string;
  brand?: string;
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export type ApiLang = 'es' | 'en';
