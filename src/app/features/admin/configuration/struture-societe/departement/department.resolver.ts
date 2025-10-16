import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Department } from '../../../../../shared/model/company';
import { DepartmentService } from '../services/department.service';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

export const departmentResolver: ResolveFn<PaginatedResponse<Department>> = (): Observable<
  PaginatedResponse<Department>
> => {
  const departmentService = inject(DepartmentService);

  return departmentService.getAll();
};
