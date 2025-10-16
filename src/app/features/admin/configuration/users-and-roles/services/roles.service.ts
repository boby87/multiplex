import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { Role } from '../../../../../shared/model/roles';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/uaa-service/roles`;

  getRoleById(roleId: string): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/${roleId}`);
  }

  createRole(role: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, role);
  }

  updateRole(roleId: string, role: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${roleId}`, role);
  }

  filterRoles(companyId?: string): Observable<PaginatedResponse<Role>> {
    const filter = companyId
      ? {
          page: 0,
          size: 15,
          sort: [],
          filters: {
            companies: { $in: [companyId] },
          },
        }
      : {
          page: 0,
          size: 15,
          sort: [],
          filters: {},
        };

    return this.http.post<PaginatedResponse<Role>>(`${this.baseUrl}/filters`, filter, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getRolesByCompany(companyId: string): Observable<PaginatedResponse<Role>> {
    return this.http.post<PaginatedResponse<Role>>(
      `${this.baseUrl}/filters`,
      {
        page: 0,
        size: 10,
        sort: [],
        filters: {
          companies: { $in: [companyId] },
        },
      },
      { headers: { 'X-Notify': 'true' } }
    );
  }

  /**
   * GET /uaa-service/acls
   * Récupère toutes les ACLs
   */
  getAllAcls(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  /**
   * POST /uaa-service/acls/available
   * Récupère les ACLs disponibles pour des rôles donnés
   * @param roleIds tableau d’ID de rôles
   */
  getAvailableAclsFromRoles(roleIds: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/available`, roleIds);
  }

  /**
   * POST /uaa-service/acls/roles
   * Récupère les ACLs assignées à des rôles spécifiques
   * @param roleIds tableau d’ID de rôles
   */
  getAclsByRoles(roleIds: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/roles`, roleIds);
  }
}
