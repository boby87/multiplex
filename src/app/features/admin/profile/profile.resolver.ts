import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PartnerService } from '../human-resources/service/partner.service';
import { Partner } from '../../../shared/model/user';
import { AuthService } from '../../../core/service/auth.service';

export const profileResolver: ResolveFn<Partner> = (route): Observable<Partner> => {
  const partnerService = inject(PartnerService);
  const authService = inject(AuthService);
  const userId = route.params['userId'] || authService.userContext.userId;
  return partnerService.getUserById(userId);
};
