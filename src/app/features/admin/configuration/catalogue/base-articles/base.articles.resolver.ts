import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { ProductBase } from '../../../../../shared/model/productCategory';
import { BaseArticleService } from '../service/base.article.service';

export const baseArticlesResolver: ResolveFn<PaginatedResponse<ProductBase>> = (): Observable<
  PaginatedResponse<ProductBase>
> => {
  const baseArticleService = inject(BaseArticleService);

  return baseArticleService.filter();
};
