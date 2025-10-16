import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { AppConfig } from '../../../../../core/config/app.config';
import { Company, LegalInfo } from '../../../../../shared/model/company';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/onboarding-service/companies`;
  private http = inject(HttpClient);

  filterCompany(): Observable<PaginatedResponse<Company>> {
    const payload = {
      page: 0,
      size: 1000,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      filters: {},
    };

    return this.http.post<PaginatedResponse<Company>>(`${this.baseUrl}/filters`, payload, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getAllCompanies() {
    return this.http.get<PaginatedResponse<Company>>(this.baseUrl);
  }
  getCompanyById(companyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${companyId}`);
  }

  getCompaniesWithFilter(token: string, filterBody: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/filters`, filterBody);
  }

  createCompany(company: Company): Observable<any> {
    return this.http.post(this.baseUrl, company);
  }

  updateCompany(companyId: string, company: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${companyId}`, company);
  }

  createAddresses(companyId: string, addresses: any): Observable<any> {
    console.log(addresses);

    return this.http.patch(`${this.baseUrl}/${companyId}/addresses`, addresses);
  }

  createLegals(companyId: string, legals: LegalInfo): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${companyId}/legals`, legals);
  }

  deleteCompany(companyId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${companyId}`);
  }

  uploadCompanyLogo(companyId: string, file: File): Observable<any> {
    const url = `${this.config.multiflexServerUrl}/media/upload`;

    const formData = new FormData();
    formData.append('files', file);

    const params = new HttpParams()
      .set('mediaTypeCodes[0]', 'PROFILE_PICTURE')
      .set('entityId', companyId)
      .set('process', 'REGISTRATION')
      .set('entityType', 'COMPANY');

    return this.http.post(url, formData, {
      params,
    });
  }
}
