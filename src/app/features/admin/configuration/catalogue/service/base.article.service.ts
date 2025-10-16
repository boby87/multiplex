import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { ProductBase } from '../../../../../shared/model/productCategory';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class BaseArticleService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/products/bases`;

  /**
   * Créer une nouvelle base produit
   */
  create(productBase: ProductBase): Observable<ProductBase> {
    return this.http.post<ProductBase>(this.baseUrl, productBase);
  }

  /**
   * Mettre à jour une base produit existante
   */
  update(id: string, productBase: ProductBase): Observable<ProductBase> {
    return this.http.put<ProductBase>(`${this.baseUrl}/${id}`, productBase);
  }

  /**
   * Récupérer une base produit par son ID
   */
  getById(id: string): Observable<ProductBase> {
    return this.http.get<ProductBase>(`${this.baseUrl}/${id}`);
  }

  /**
   * Filtrer les bases produit avec pagination
   */
  filter(params?: {
    page?: number;
    size?: number;
    sort?: { field: string; direction: 'asc' | 'desc' }[];
    filters?: any;
  }): Observable<PaginatedResponse<ProductBase>> {
    const body = {
      page: params?.page ?? 0,
      size: params?.size ?? 10000,
      sort: params?.sort ?? [],
      filters: {
        classType: 'PRODUCT',
        ...(params?.filters || {}),
      },
    };
    return this.http.post<PaginatedResponse<ProductBase>>(`${this.baseUrl}/filters`, body);
  }
}
