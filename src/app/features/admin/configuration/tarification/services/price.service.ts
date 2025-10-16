import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { Price, PriceListAttribute } from '../../../../../shared/model/productCategory';

@Injectable({ providedIn: 'root' })
export class PriceService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/products/pricelists`;

  getById(id: string): Observable<Price> {
    return this.http.get<Price>(`${this.baseUrl}/${id}`);
  }

  create(payload: Price): Observable<Price> {
    return this.http.post<Price>(this.baseUrl, payload);
  }

  update(id: string, payload: Price): Observable<Price> {
    return this.http.put<Price>(`${this.baseUrl}/${id}`, payload);
  }

  patchAttributes(id: string, attributes: Partial<PriceListAttribute>): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/attributes`, attributes);
  }

  getAll(): Observable<PaginatedResponse<Price>> {
    const filters = {
      page: 0,
      size: 10000,
      sort: [
        {
          field: 'patronPrice',
          direction: 'desc',
        },
      ],
      filters: {},
    };
    return this.http.post<PaginatedResponse<Price>>(`${this.baseUrl}/filters`, filters);
  }

  getByVariantId(variantId: string): Observable<Price[]> {
    return this.http.get<Price[]>(`${this.baseUrl}/variants/${variantId}`);
  }

  getRenderedByVariantAndCompany(variantId: string, companyId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/renderer`, {
      params: { variantId, companyId },
    });
  }
}
