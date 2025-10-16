import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { Acl, Role } from '../../../../../shared/model/roles';



@Injectable({
  providedIn: 'root',
})
export class AclService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/uaa-service`;
  /** 🔹 Get all ACLs */
  getAllAcls(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/acls`);
  }

  /** 🔹 Get available ACLs by roles */
  getAvailableAcls(roles: string[], companyId: string): Observable<Acl[]> {
    return this.http.post<Acl[]>(`${this.baseUrl}/acls/available`, { roles, companyId });
  }

  /** 🔹 Get roles by company */
  getRolesByCompany(companyId: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles/company/${companyId}`);
  }

  /** 🔹 Get ACLs by roles */
  getAclsByRoles(roles: string[], companyId: string): Observable<Acl[]> {
    return this.http.post<Acl[]>(`${this.baseUrl}/acls/roles`, { roles, companyId });
  }

  /** 🔹 Get ACL by code */
  getAclByCode(aclCode: string): Observable<Acl> {
    return this.http.get<Acl>(`${this.baseUrl}/acls/${aclCode}`);
  }

  /** 🔹 Patch role with ACL (replace permissions) */
  patchRoleAcl(roleId: string, acl: {code: string, permissions: string[]}): Observable<any> {
    return this.http.patch(`${this.baseUrl}/roles/${roleId}/acl`, acl);
  }
}
