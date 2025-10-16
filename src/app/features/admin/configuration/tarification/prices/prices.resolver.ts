import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { Price } from '../../../../../shared/model/productCategory';
import { PriceService } from '../services/price.service';

export const pricesResolver: ResolveFn<PaginatedResponse<Price>> = (): Observable<
  PaginatedResponse<Price>
> => {
  const priceService = inject(PriceService);

  return priceService.getAll();
};
