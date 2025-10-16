import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from '../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../core/config/config.token';
import { PaginatedResponse } from '../../../../shared/model/paginatedResponse';
import { Partner, TechnicienEntreprise } from '../../../../shared/model/user';
import { MediaConfig } from '../../../../shared/model/media';

@Injectable({
  providedIn: 'root',
})
export class TechnicienService {
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/onboarding-service/partners`;
  private http = inject(HttpClient);

  getAllTechnicians(
    type: string,
    page = 0,
    size = 10,
    sort = 'name,asc'
  ): Observable<PaginatedResponse<TechnicienEntreprise>> {
    const params = new HttpParams()
      .set('type', type)
      .set('paginated', 'true')
      .set('page', page)
      .set('size', size)
      .append('sort', sort);

    return this.http.get<PaginatedResponse<TechnicienEntreprise>>(`${this.baseUrl}`, { params });
  }

  getTechnicianById(id: string, type: 'TECHNICIAN' | 'PHYSICAL'): Observable<TechnicienEntreprise> {
    const params = new HttpParams().set('type', type);
    return this.http.get<TechnicienEntreprise>(`${this.baseUrl}/${id}`, { params });
  }

  filterTechnicians(technicianType: 'PHYSICAL' | 'BUSINESS'): Observable<PaginatedResponse<TechnicienEntreprise>> {
    const payload = {
      page: 0,
      size: 1000,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      filters: {
        partnerType: "TECHNICIAN",
        "partnerAttribute.technicianCategory": {
          $regex: technicianType
        }
      }
    };
    return this.http.post<PaginatedResponse<TechnicienEntreprise>>(
      `${this.baseUrl}/filters`,
      payload, {headers: { 'X-Notify': 'true' } }
    );
  }


  createTechnician(payload: Partner): Observable<Partner> {
    return this.http.post<Partner>(`${this.baseUrl}`, payload);
  }

  updatePhysicalDetails(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/addPhysicalTechnician`, payload);
  }

  updateBusinessDetails(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/addBusinessTechnician`, payload);
  }

  updateBusinessManager(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/addBusinessTechnicianManager`, payload);
  }

  updateTechnicianAddresses(id: string, addresses: any[]): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/addresses`, addresses);
  }

  updateTechnicianContacts(id: string, contacts: any[]): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/contacts`, contacts);
  }

  updateTechnicianSkills(id: string, skills: { skills: string[] }): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/addTechnicianSkills`, skills);
  }

  updateTechnicianUserInfos(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/userInfos`, payload);
  }

  updateTechnicianCompanies(id: string, companies: any[]): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/companies`, companies);
  }

  addCompanyToTechnician(id: string, companyData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/addCompany`, companyData);
  }


  uploadFile(entityId: string, subEntity: string, mediaTypeCode: string, file: File): Observable<any> {
    const url = `${this.config.multiflexServerUrl}/media/upload`;

    const params = new HttpParams()
      .append('mediaTypeCodes[0]', mediaTypeCode)
      .append('entityId', entityId)
      .append('entityType', 'TECHNICIAN')
      .append('process', 'REGISTRATION')
      .append('subEntity', subEntity);

    const formData = new FormData();
    formData.append('files', file);

    return this.http.post(url, formData, { params });
  }

  getMediaConfig(
    subEntityType: string
  ): Observable<MediaConfig[]> {
    const params = new HttpParams()
      .append('entityType', 'TECHNICIAN')
      .append('process', 'REGISTRATION')
      .set('subEntityType', subEntityType);
    return this.http.get<MediaConfig[]>(`${this.config.multiflexServerUrl}/media/entity-configs/entities`, { params });
  }
}
