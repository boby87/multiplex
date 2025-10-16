import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { TechnicienService } from './services/technicien.service';

export const technicianResolver: ResolveFn<any> = (route, state): Observable<any> => {
  const technicianService = inject(TechnicienService);
  if (state.url === '/crm/technician-business') {
    return technicianService.filterTechnicians('BUSINESS');
  } else {
    return technicianService.filterTechnicians('PHYSICAL');
  }
};
