import { Company } from './company';
import { Media } from './media';

export interface ProductCategory {
  productCategoryId?: string;
  name: string;
  code: string;
  description?: string;
  parent?: { id: string };
  leaf?: boolean;
}
export interface ProductBase {
  productId?: string;
  code: string;
  designation?: string;
  superCategory?: string;
  productCategory?: { code: string };
  productType?: string;
  status?: string;
}
export interface BaseProductRef {
  id: string;
}

export interface UOMRef {
  code: string;
}

export interface ProductSpecs {
  type: string;
  yieldSurface: string;
  yieldSurfaceUom: string;
  duration: number;
  durationUom: string;
  durationAfter: number;
  layersCount: number;
  defaultSecurityQuantity: string;
  productAdvice: string;
}

export interface ProductVariant {
  baseProduct?: BaseProductRef;
  code?: string;
  superCategory?: string;
  id?: string;
  productVariantId?: string;
  designation?: string;
  status?: string;
  detailedDescription?: string;
  uom?: UOMRef;
  productCategory?: ProductCategory,
  productSpecs?: ProductSpecs;
  galleryImages?: Media[];
  urlImage?: string;
}
export interface ProductUom {
  uomId?: string;
  name: string;
  code: string;
  description?: string;
}
export interface PriceListAttribute {
  type: string; // "PROCEDE_QUOTATION" | "PRODUCT_QUOTATION" | ...
  name?: string;
  description?: string;
  laborerPrice?: number;
  technicianPrice?: number;
  patronPrice?: number;
  fixPrice?: number;
  productMargin?: number;
  minLaborerMargin?: number;
  maxLaborerMargin?: number;
}

export interface Price {
  priceListId?: string;
  priceListName?: string;
  currency?: 'XAF' | 'XOF' | 'EUR' | 'USD';
  priceListType?: string;
  companie?: string;
  company?: Company | string;
  productVariant?: ProductVariant;
  priceListAttribute?: PriceListAttribute;
  laborerPrice?: number;
  technicianPrice?: number;
  patronPrice?: number;
}
