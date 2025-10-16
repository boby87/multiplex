import { clone } from 'lodash';
import {
  PRICE_PROCEED_QUOTATION_FIELDS,
  PRICE_PRODUCT_QUOTATION_FIELDS,
} from '../../../../../../../shared/components/templates/price';

export interface PriceListTypeStrategy {
  buildFields(): any[];
}

export class ProceedQuotationStrategy implements PriceListTypeStrategy {
  buildFields(): any[] {
    const fields = clone(PRICE_PROCEED_QUOTATION_FIELDS);
    const typeField = fields.find(f => f.key === 'type');
    if (typeField) typeField.value = 'PROCEDE_QUOTATION';
    return fields;
  }
}

export class ProductQuotationStrategy implements PriceListTypeStrategy {
  buildFields(): any[] {
    const fields = clone(PRICE_PRODUCT_QUOTATION_FIELDS);
    const typeField = fields.find(f => f.key === 'type');
    if (typeField) typeField.value = 'PRODUCT_QUOTATION';
    return fields;
  }
}

export class PriceListStrategyFactory {
  private  static readonly mapping: Record<string, string> = {
    PAINT: 'PRODUCT_QUOTATION',
    SERVICE: 'PRODUCT_QUOTATION',
    PROCEDE: 'PROCEDE_QUOTATION',
    MATERIAL: 'PRODUCT_QUOTATION',
    PREPARATION: 'PRODUCT_QUOTATION',
    CEMENT: 'PRODUCT_QUOTATION',
  };



  static create(type: string): PriceListTypeStrategy | null {

    switch (this.mapping[type]) {
      case 'PROCEDE_QUOTATION':
        return new ProceedQuotationStrategy();
      case 'PRODUCT_QUOTATION':
        return new ProductQuotationStrategy();
      default:
        return null;
    }
  }
}
