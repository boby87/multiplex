import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { AppConfig } from '../../../../../core/config/app.config';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { Company, Job } from '../../../../../shared/model/company';


export interface UserSummary {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  fullName?: string;
  currentCompanyId?: string;
  defaultCompanyId?: string;
  timezone?: string;
  language?: string;
  allowedCompanies?: AllowedCompany[];
}

export type SortDirection = 'asc' | 'desc';

export interface UserFilterRequest {
  page: number;
  size: number;
  sort: { field: string; direction: SortDirection }[];
  filters: {
    username?: string;
    // Ex: "allowedCompanies.company.id": "BES"
    [key: string]: string | number | boolean | undefined;
  };
}

export interface PartnerProfile {
  id: string;
  username: string;
  partnerId?: string;
  email?: string;
  contacts?: Contact[];
  addresses?: Address[];
  defaultCompanyId?: string;
  userSummary?: UserSummary;
  // ajoute ici les champs selon ton modèle
}
// Accès d’un utilisateur à une société
export interface AllowedCompany {
  company: Company;
  roles: string[];
  job: Job | null;
  permissions: string[] | null;
  defaultCompany: boolean;
}
export interface ChangePasswordAdminPayload {
  newPassword: string;
}

export interface ChangePasswordSelfPayload {
  oldPassword: string;
  newPassword: string;
}

export interface EmailUpdatePayload {
  email: string;
}

export interface Contact {
  phone: string;
  defaultContact: boolean;
  whatsapp: boolean;
}

export interface Address {
  addressType: 'HOME' | 'WORK' | 'OTHERS' | string;
  street: string;
  complement?: string;
  postalCode?: string;
  quarter?: string;
  city: string;
  region?: string;
  country: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  defaultAddress: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);

  /**
   * Si ton UAA est sur une autre base URL, expose `multiflexServerUrlUaa` dans AppConfig
   * et remplace la ligne ci-dessous par: this.config.multiflexServerUrlUaa
   */
  private baseUrl = this.config.multiflexServerUrl;

  private uaaUsersBase = `${this.baseUrl}/uaa-service/users`;
  private uaaUsersProfileBase = `${this.baseUrl}/uaa-service/users/profile`;
  private partnersProfileBase = `${this.baseUrl}/onboarding-service/partners/profile`;

  // ---------- USER FILTERS ----------

  filterUsers(req: UserFilterRequest): Observable<PaginatedResponse<UserSummary>> {
    const url = `${this.uaaUsersBase}/filters`;
    return this.http.post<PaginatedResponse<UserSummary>>(url, req, {
      headers: { 'X-Notify': 'true' },
    });
  }

  // ---------- PROFILE - GET SELF PARTNER INFOS ----------

  getSelfPartnerProfile(username: string): Observable<PartnerProfile> {
    const url = `${this.partnersProfileBase}/${encodeURIComponent(username)}`;
    return this.http.get<PartnerProfile>(url, {
      headers: { 'X-Notify': 'false' },
    });
  }

  // ---------- PROFILE - CHANGE PASSWORD BY AN ADMIN ----------

  changePasswordAsAdmin(username: string, newPassword: string): Observable<void> {
    const url = `${this.uaaUsersBase}/${encodeURIComponent(username)}/password`;
    const body: ChangePasswordAdminPayload = { newPassword };
    return this.http.patch<void>(url, body, {
      headers: { 'X-Notify': 'true' },
    });
  }

  // ---------- PROFILE - CHANGE PASSWORD BY SELF ----------

  changeUserInfos(username: string, payload: any, updateType: string, userId: string): Observable<void> {
    const url = `${this.partnersProfileBase}/${username}/${updateType!=='adminPassword' ? updateType : 'password'}?id=${userId}`;
    return this.http.patch<void>(url, payload, {
      headers: { 'X-Notify': 'true' },
    });
  }

  // ---------- PROFILE - CHANGE SELF EMAIL ----------

  updateOwnEmail(username: string, userId: string, email: string): Observable<void> {
    const url = `${this.partnersProfileBase}/${encodeURIComponent(username)}/email`;
    const params = new HttpParams().set('id', userId);
    const body: EmailUpdatePayload = { email };
    return this.http.patch<void>(url, body, {
      params,
      headers: { 'X-Notify': 'true' },
    });
  }

  // ---------- PROFILE - CHANGE SELF CONTACTS ----------

  updateOwnContacts(username: string, userId: string, contacts: Contact[]): Observable<void> {
    const url = `${this.partnersProfileBase}/${encodeURIComponent(username)}/contacts`;
    const params = new HttpParams().set('id', userId);
    return this.http.patch<void>(url, contacts, {
      params,
      headers: { 'X-Notify': 'true' },
    });
  }

  // ---------- PROFILE - CHANGE SELF ADDRESSES ----------

  updateOwnAddresses(username: string, userId: string, addresses: Address[]): Observable<void> {
    const url = `${this.partnersProfileBase}/${encodeURIComponent(username)}/addresses`;
    const params = new HttpParams().set('id', userId);
    return this.http.patch<void>(url, addresses, {
      params,
      headers: { 'X-Notify': 'true' },
    });
  }

  // ---------- PROFILE - CHANGE DEFAULT COMPANY ----------

  changeDefaultCompany(username: string, userId: string, companyId: string): Observable<void> {
    const url = `${this.partnersProfileBase}/${encodeURIComponent(username)}/defaultCompany`;
    const params = new HttpParams().set('id', userId);
    return this.http.patch<void>(url, { companyId }, {
      params,
      headers: { 'X-Notify': 'true' },
    });
  }

  // ---------- PROFILE - SWITCH COMPANY (UAA) ----------

  switchCompany(username: string, userId: string, companyId: string): Observable<void> {
    const url = `${this.partnersProfileBase}/${encodeURIComponent(username)}/switchCompany`;
    const params = new HttpParams().set('id', userId);
    return this.http.patch<void>(url, { companyId }, {
      params,
      headers: { 'X-Notify': 'true' },
    });
  }
}
