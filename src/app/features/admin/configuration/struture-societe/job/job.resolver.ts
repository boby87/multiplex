import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { JobService } from '../services/job.service';
import { Job } from '../../../../../shared/model/company';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

export const jobResolver: ResolveFn<PaginatedResponse<Job>> = (): Observable<
  PaginatedResponse<Job>
> => {
  const jobService = inject(JobService);

  return jobService.getAll();
};
