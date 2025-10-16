import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { SkillService } from '../services/skill.service';
import { MultiflexStaticService } from '../../../../../core/service/stactic.core.service';
import { RouterNavigation } from '../../../../../shared/utility/router.navigation';

export const skillResolver: ResolveFn<any> = (route, state): Observable<any> => {
  const skillService = inject(SkillService);
  const multiflexStaticService = inject(MultiflexStaticService);

  const isAddTechnician =
    state.url.includes(RouterNavigation.ADD_TECHNICIAN_PHYSICAL) ||
    state.url.includes(RouterNavigation.ADD_TECHNICIAN_BUSINESS);
  const fetchIfAddTech = <T>(fn: () => Observable<T>) => (isAddTechnician ? fn() : of(null));

  return forkJoin({
    categoryTechnician: fetchIfAddTech(() => multiflexStaticService.getTechnicianCategory()),
    typeTechnician: fetchIfAddTech(() => multiflexStaticService.getTechnicianType()),
    gradeTechnician: fetchIfAddTech(() => multiflexStaticService.getTechnicianGrade()),
    taxRegime: fetchIfAddTech(() => multiflexStaticService.getTaxRegime()),
    skills: skillService.getAll(),
  });
};
