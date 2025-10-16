import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PartnerService } from '../service/partner.service';
import { forkJoin, Observable, of } from 'rxjs';

export const employeesResolver: ResolveFn<any> = (route): Observable<any> => {
  const partnerService = inject(PartnerService);
  const isAddVariante = route.url.some(value => value.path === 'add-employees');
  return forkJoin({
    partners: partnerService.filterPartners(),
    medias: isAddVariante ?  partnerService.getMediaConfig(): of(null)
  })
};
