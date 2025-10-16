import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../service/category.service';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { ProductCategory } from '../../../../../shared/model/productCategory';

export const categoryResolver: ResolveFn<PaginatedResponse<ProductCategory>> = (): Observable<
  PaginatedResponse<ProductCategory>
> => {
  const categoryService = inject(CategoryService);

  return categoryService.filterCategories();
};
