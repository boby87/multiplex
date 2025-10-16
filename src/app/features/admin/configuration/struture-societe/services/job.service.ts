import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Job } from '../../../../../shared/model/company';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

export interface JobFilterRequest {
  page: number;
  size: number;
  sort: { field: string; direction: 'asc' | 'desc' }[];
  filters: {
    name?: string;
    companyId?: string;
    departmentId?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/onboarding-service/jobs`;

  getAll(paginated = false, page = 0, size = 1000): Observable<PaginatedResponse<Job>> {
    const params = new HttpParams()
      .set('paginated', `${paginated}`)
      .set('page', `${page}`)
      .set('size', `${size}`)
      .append('sort', 'name,asc')
      .append('sort', 'createdAt,desc');

    return this.http
      .get<PaginatedResponse<Job>>(this.baseUrl, { params, headers: { 'X-Notify': 'true' } })
      .pipe(
        map(response => ({
          ...response,
          content: response.content.map(content => ({
            ...content,
            companyName: content.company?.name,
            departmentName: content.department?.name,
            departmentId: content.department?.id,
            companyId: content.company?.id,
          })),
        }))
      );
  }

  filterJobs(companyId: string): Observable<PaginatedResponse<Job>> {
    const filterRequest: JobFilterRequest = {
      page: 0,
      size: 10,
      sort: [{ field: 'name', direction: 'asc' }],
      filters: {
        companyId: companyId,
      },
    };
    return this.http.post<PaginatedResponse<Job>>(`${this.baseUrl}/filters`, filterRequest);
  }

  createJob(job: any): Observable<Job> {
    return this.http.post<Job>(this.baseUrl, job);
  }

  updateJob(id: string, job: any): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}/${id}`, job);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
