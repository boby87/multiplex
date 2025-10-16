import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../../core/config/config.token';
import { ProductUom } from '../../../../../../shared/model/productCategory';
import { PaginatedResponse } from '../../../../../../shared/model/paginatedResponse'; // adapte le chemin

@Injectable({ providedIn: 'root' })
export class UniteOfMeasureService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/products/uoms`;

  getById(id: string): Observable<ProductUom> {
    return this.http.get<ProductUom>(`${this.baseUrl}/${id}`);
  }

  create(uom: ProductUom): Observable<ProductUom> {
    return this.http.post<ProductUom>(this.baseUrl, uom);
  }

  update(id: string, uom: ProductUom): Observable<ProductUom> {
    return this.http.put<ProductUom>(`${this.baseUrl}/${id}`, uom);
  }

  filter(): Observable<PaginatedResponse<ProductUom>> {
    return this.http.post<PaginatedResponse<ProductUom>>(`${this.baseUrl}/filters`, {
      page: 0,
      size: 15,
      sort: [{ field: 'code', direction: 'desc' }],
      filters: {},
    });
  }
}
