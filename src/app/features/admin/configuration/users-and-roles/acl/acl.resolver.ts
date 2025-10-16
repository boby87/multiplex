import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Acl } from '../../../../../shared/model/roles';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { AclService } from '../services/Acl.service';

export const aclResolver: ResolveFn<PaginatedResponse<Acl>> = (): Observable<
  PaginatedResponse<Acl>
> => {
  const aclService = inject(AclService);

  return aclService.getAllAcls();
};
