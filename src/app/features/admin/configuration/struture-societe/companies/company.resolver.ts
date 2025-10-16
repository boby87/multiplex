import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { CompanyService } from '../services/company.service';
import { Company } from '../../../../../shared/model/company';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

export const companyResolver: ResolveFn<PaginatedResponse<Company>> = (): Observable<
  PaginatedResponse<Company>
> => {
  const companyService = inject(CompanyService);

  return companyService.filterCompany().pipe(
    catchError(error => {
      throw Error(error);
    })
  );
};
