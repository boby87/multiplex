import { MultiflexStaticService } from '../../../../../../../core/service/stactic.core.service';
import { BaseDynamicForm } from '../../../../../../../shared/components/input_type/dynamic.form';
import { CompanyService } from '../../../../struture-societe/services/company.service';
import { Select } from '../../../../../../../shared/components/input_type/select';
import { inject } from '@angular/core';
import { ProductVariant } from '../../../../../../../shared/model/productCategory';
import { Textbox } from '../../../../../../../shared/components/input_type/textbox';

export interface FieldOptionStrategy {
  supports(field: BaseDynamicForm): boolean;
  fillOptions(field: BaseDynamicForm): void;
}

export class PriceTypeStrategy implements FieldOptionStrategy {
  constructor(private staticService: MultiflexStaticService) {}
  supports(field: BaseDynamicForm): boolean {
    return field.key === 'type';
  }

  fillOptions(field: BaseDynamicForm): void {
    this.staticService.getPriceListTypes().subscribe(priceTypes => {
      field.options = priceTypes.map(p => ({ key: p.key, value: p.key }));
    });
  }
}

export class CurrencyStrategy implements FieldOptionStrategy {
  constructor(private staticService: MultiflexStaticService) {}

  supports(field: BaseDynamicForm): boolean {
    return field.key === 'currency';
  }

  fillOptions(field: BaseDynamicForm): void {
    this.staticService.getCurrencies().subscribe(currencies => {
      field.options = currencies.map(c => ({ key: c.key, value: c.key }));
    });
  }
}

export class CompanyStrategy implements FieldOptionStrategy {
  constructor(private companyService: CompanyService) {}
  supports(field: BaseDynamicForm): boolean {
    return field.key === 'company' && field.controlType === 'formGroup';
  }

  fillOptions(field: BaseDynamicForm): void {
    this.companyService.filterCompany().subscribe(companies => {
      field.groupFields = field.groupFields.map(f => {
        if (f.key === 'id' && f.controlType === 'select') {
          (f as Select).options = companies.content.map(c => ({
            key: c.companyId!,
            value: c.code!,
          }));
        }
        return f;
      });
    });
  }
}

export class ProductVariantStrategy implements FieldOptionStrategy {
  constructor(private productVariant: ProductVariant) {}
  supports(field: BaseDynamicForm): boolean {
    return field.key === 'productVariant' && field.controlType === 'formGroup';
  }

  fillOptions(field: BaseDynamicForm): void {
    field.groupFields = field.groupFields.map(f => {
      if (f.key === 'id' && f.controlType === 'textbox') {
        (f as Textbox).value = this.productVariant.code;
      }
      return f;
    });
  }
}
