import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { ProductVariant } from '../../../../../shared/model/productCategory';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';
import { MediaConfig } from '../../../../../shared/model/media';

@Injectable({ providedIn: 'root' })
export class ProductVariantsService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/products/variants`;
  private baseUrlUoms = `${this.config.multiflexServerUrl}/products/uoms`;

  createVariant(payload: ProductVariant): Observable<any> {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  updateVariant(id: string, payload: ProductVariant): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }
  createUom(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrlUoms}`, payload);
  }

  updateUom(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrlUoms}/${id}`, payload);
  }

  getVariantById(id: string): Observable<ProductVariant> {
    return this.http.get<ProductVariant>(`${this.baseUrl}/${id}`);
  }

  filterVariants(): Observable<PaginatedResponse<ProductVariant>> {
    const filters = {
      page: 0,
      size: 65,
      sort: [
        { field: "code", "direction": "asc" }
      ],
      filters: { classType: 'VARIANT' },
    };
    return this.http.post<PaginatedResponse<ProductVariant>>(`${this.baseUrl}/filters`, filters);
  }

  patchVariantSpecs(id: string, specs: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/specification`, specs);
  }

  linkMediasToVariant(productId: string, mediaPayload: any[]): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${productId}/medias`, mediaPayload);
  }

  getProductVariantById(productId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/variants/${productId}`);
  }

  /**
   * Étape 1 : Récupère la configuration des types de médias disponibles pour un type d'entité
   */
  getEntityMediaConfig(entityType: string, process: string): Observable<any> {
    const params = new HttpParams().set('entityType', entityType).set('process', process);

    return this.http.get(`${this.baseUrl}/media/entity-configs/entity`, { params });
  }

  /**
   * Étape 2 : Upload un fichier média et l’associe à une entité
   */
  uploadMedia(file: File, mediaTypeCodes: string, entityId: string): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);

    const params = new HttpParams()
      .set(`mediaTypeCodes[0]`, mediaTypeCodes)
      .set('entityId', entityId)
      .set('entityType', 'PRODUCT')
      .set('process', 'REGISTRATION');

    return this.http.post(`${this.config.multiflexServerUrl}/media/upload`, formData, {
      params,
    });
  }

  /**
   * Étape 3 : Récupère tous les médias associés à une entité
   */
  getMediaConfig(): Observable<MediaConfig> {
    const params = new HttpParams().set('entityType', 'PRODUCT').set('process', 'REGISTRATION');
    return this.http.get<MediaConfig>(
      `${this.config.multiflexServerUrl}/media/entity-configs/entity`,
      { params }
    );
  }
}
