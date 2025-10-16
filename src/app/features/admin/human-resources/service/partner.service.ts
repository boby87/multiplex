import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../../core/config/config.token';
import { AppConfig } from '../../../../core/config/app.config';
import { PaginatedResponse } from '../../../../shared/model/paginatedResponse';
import { EmployeeContract, Partner } from '../../../../shared/model/user';
import { MediaConfig } from '../../../../shared/model/media';


@Injectable({ providedIn: 'root' })
export class PartnerService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/onboarding-service/partners`;
  private MEDIA_ENDPOINT = `${this.config.multiflexServerUrl}/media`;

  getEmployeeById(employeeId: string): Observable<Partner> {
    const params = new HttpParams().set('type', 'TECHNICIAN');

    return this.http.get<Partner>(`${this.baseUrl}/${employeeId}`, {
      params,
    });
  }

  getUserById(employeeId: string): Observable<Partner> {

    return this.http.get<Partner>(`${this.baseUrl}/by-id/${employeeId}`);
  }

  /**
   * Filter partners with structured filters
   */
  filterPartners(): Observable<PaginatedResponse<Partner>> {
    const filterRequest = {
      page: 0,
      size: 50,
      sort: [
        { field: 'name', direction: 'asc' },
        { field: 'createdAt', direction: 'desc' },
      ],
      filters: {
        partnerType: 'IOLA_EMPLOYEE', // Ajout du champ ici
      },
    };
    return this.http.post<PaginatedResponse<Partner>>(`${this.baseUrl}/filters`, filterRequest, { headers: { 'X-Notify': 'true' } });
  }

  /**
   * Create a new IOLA employee partner
   */
  createPartner(payload: Partner): Observable<Partner> {
    payload.partnerType = 'IOLA_EMPLOYEE';
    payload.name = `${payload.partnerAttribute?.firstname} ${payload.partnerAttribute?.lastname}`;
    payload.parentId = null;
    if (payload.partnerAttribute) {
      payload.partnerAttribute.type = 'IOLA_EMPLOYEE';
    }

    return this.http.post<Partner>(this.baseUrl, payload);
  }

  /**
   * Update employee contract
   */
  updateEmployeeContract(partnerId: string, payload: EmployeeContract): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${partnerId}/employeeContract`, payload);
  }

  /**
   * Update companies assigned to an employee
   */
  updateEmployeeCompanies(partnerId: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${partnerId}/companies`, payload);
  }

  /**
   * Update user info and roles
   */
  updateEmployeeUserInfos(partnerId: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${partnerId}/userInfos`, payload);
  }

  /**
   * Upload un fichier PDF comme contrat pour un employé
   */
  uploadContractFile(employeeId: string, file: File, mediaTypeCodes: string): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);

    const params = new HttpParams()
      .set(`mediaTypeCodes[0]`, mediaTypeCodes)
      .set('entityId', employeeId)
      .set('entityType', 'EMPLOYEE')
      .set('process', 'REGISTRATION');

    return this.http.post(`${this.MEDIA_ENDPOINT}/upload`, formData, { params });
  }

  getMediaConfig(): Observable<MediaConfig> {
    const url = `${this.MEDIA_ENDPOINT}/entity-configs/entity`;
    const params = new HttpParams()
      .set('entityType', 'EMPLOYEE')
      .set('process', 'REGISTRATION');

    return this.http.get<MediaConfig>(url, { params, });
  }

  changeDefaultCompany(
    username: string,
    userId: string,
    companyId: string,
  ): Observable<any> {
    const url = `${this.baseUrl}/profile/${username}/defaultCompany?id=${userId}`;
    const body = { companyId };
    return this.http.patch(url, body);
  }

  /**
   * Switch Company
   */
  switchCompany(
    username: string,
    userId: string,
    companyId: string,
  ): Observable<any> {
    const url = `${this.config.multiflexServerUrl}/uaa-service/users/profile/${username}/switchCompany?id=${userId}`;
    const body = { companyId };
    return this.http.patch(url, body);
  }
}
