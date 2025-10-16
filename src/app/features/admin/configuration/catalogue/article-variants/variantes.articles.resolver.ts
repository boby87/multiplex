import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { ProductVariantsService } from '../service/product-variants.service';

export const variantesArticlesResolver: ResolveFn<any> = (route): Observable<any> => {
  const productVariantsService = inject(ProductVariantsService);
  const isAddVariante = route.url.some(value => value.path === 'add-variants-articles');
  return forkJoin({
    variants: !isAddVariante ? productVariantsService.filterVariants() : of(null),
    mediaConfig: isAddVariante ? productVariantsService.getMediaConfig() : of(null),
  });
};
