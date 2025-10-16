import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from '../services/roles.service';
import { Role } from '../../../../../shared/model/roles';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

export const rolesResolver: ResolveFn<PaginatedResponse<Role>> = (): Observable<
  PaginatedResponse<Role>
> => {
  const roleService = inject(RoleService);

  return roleService.filterRoles();
};
