import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { ProductUom } from '../../../../../shared/model/productCategory';
import { UniteOfMeasureService } from './services/unite.of.measure.service';

export const uniteOfMeasureResolver: ResolveFn<PaginatedResponse<ProductUom>> = (): Observable<
  PaginatedResponse<ProductUom>
> => {
  const uniteOfMeasureService = inject(UniteOfMeasureService);

  return uniteOfMeasureService.filter();
};
