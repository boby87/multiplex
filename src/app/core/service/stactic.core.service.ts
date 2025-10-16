import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';
import { APP_CONFIG } from '../config/config.token';

@Injectable({
  providedIn: 'root',
})
export class MultiflexStaticService {
  private config = inject<AppConfig>(APP_CONFIG);
  private readonly baseUrl = `${this.config.multiflexServerUrl}/core-static`;
  private http = inject(HttpClient);

  getCurrencies(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/currency`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getPriceListTypes(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/pricelist-type`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getProductTypes(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/product-type`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getSuperCategories(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/super-category`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getPriceListAttributeTargets(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(
      `${this.baseUrl}/price-list-attribute-target`,
      { headers: { 'X-Notify': 'true' } }
    );
  }

  getProductClasses(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/product-class`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getAddress(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/address-type`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getTechnicianGrade(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/technician-grade`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getTechnicianCategory(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/technician-category`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getTechnicianType(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/technician-type`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getTaxRegime(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/tax-regime`, {
      headers: { 'X-Notify': 'true' },
    });
  }

  getZoneType(): Observable<{ key: string; value: string }[]> {
    return this.http.get<{ key: string; value: string }[]>(`${this.baseUrl}/zone-type`, {
      headers: { 'X-Notify': 'true' },
    });
  }
}
