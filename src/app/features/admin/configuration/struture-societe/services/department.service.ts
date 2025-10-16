import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { JobFilterRequest } from './job.service';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { Department } from '../../../../../shared/model/company';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

export interface DepartmentFilterRequest {
  page: number;
  size: number;
  sort: { field: string; direction: 'asc' | 'desc' }[];
  filters: {
    name?: string;
    companyId?: string;
    parentId?: string | null;
  };
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/onboarding-service/departments`;

  getAll(paginated = true, page = 0, size = 1000): Observable<PaginatedResponse<Department>> {
    const params = new HttpParams()
      .set('paginated', `${paginated}`)
      .set('page', `${page}`)
      .set('size', `${size}`)
      .append('sort', 'name,asc')
      .append('sort', 'createdAt,desc');

    return this.http
      .get<
        PaginatedResponse<Department>
      >(`${this.baseUrl}`, { params, headers: { 'X-Notify': 'true' } })
      .pipe(
        map(response => ({
          ...response,
          content: response.content.map(content => ({
            ...content,
            parentName: content.parent?.name,
            companyName: content.company?.name,
            parentId: content.parent?.id,
            companyId: content.company?.id,
          })),
        }))
      );
  }

  filterDepartments(departmentId: string): Observable<PaginatedResponse<Department>> {
    const filterRequest: JobFilterRequest = {
      page: 0,
      size: 10,
      sort: [{ field: 'name', direction: 'asc' }],
      filters: {
        companyId: departmentId,
      },
    };
    return this.http.post<PaginatedResponse<Department>>(`${this.baseUrl}/filters`, filterRequest);
  }

  createDepartment(dept: Department): Observable<any> {
    return this.http.post(this.baseUrl, dept);
  }

  updateDepartment(id: string, dept: Department): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dept);
  }

  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
