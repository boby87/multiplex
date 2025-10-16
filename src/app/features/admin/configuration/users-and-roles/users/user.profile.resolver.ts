import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { UserProfileService, UserSummary } from '../services/users.profile.service';

export const userProfileResolver: ResolveFn<PaginatedResponse<UserSummary>> = (): Observable<
  PaginatedResponse<UserSummary>
> => {
  const roleService = inject(UserProfileService);

  return roleService.filterUsers({
    page: 0,
    size: 1000,
    sort: [{ field: 'name', direction: 'asc' }],
    filters: {},
  });
};
