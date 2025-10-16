import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';
import { APP_CONFIG } from '../config/config.token';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private config = inject<AppConfig>(APP_CONFIG);

  private http = inject(HttpClient);
  private baseUrl = `${this.config.multiflexServerUrl}/media`;

  // --------------------- Media Types ---------------------
  getAllMediaTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/types`);
  }

  getMediaTypeById(mediaTypeId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/types/${mediaTypeId}`);
  }

  getMediaTypeByCode(code: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/types/code/${code}`);
  }

  getMediaTypesByCategory(category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/types`, { params: { category } });
  }

  getMediaTypesByStatus(status: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/types`, { params: { status } });
  }

  getMediaTypesByCategoryAndStatus(category: string, status: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/types`, { params: { category, status } });
  }

  createMediaType(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/types`, payload);
  }

  updateMediaType(mediaTypeId: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/types/${mediaTypeId}`, payload);
  }

  deleteMediaType(mediaTypeId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/types/${mediaTypeId}`);
  }

  // --------------------- Entity Media Config ---------------------
  createEntityMediaConfig(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/entity-configs`, payload);
  }

  updateEntityMediaConfig(configId: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/entity-configs/${configId}`, payload);
  }

  deleteEntityMediaConfig(configId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/entity-configs/${configId}`);
  }

  getEntityMediaConfigById(configId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/entity-configs/${configId}`);
  }

  getMediaConfigForEntity(
    entityType: string,
    subEntityType: string,
    process: string
  ): Observable<any> {
    return this.http.get(`${this.baseUrl}/entity-configs/entity`, {
      params: { entityType, subEntityType, process },
    });
  }

  getAllMediaConfigsForEntity(entityType: string, subEntityType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/entity-configs/entities`, {
      params: { entityType, subEntityType },
    });
  }

  getMediaConfigsByEntityType(entityType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/entity-configs/entity-type/${entityType}`);
  }

  getMediaTypesForEntity(
    entityType: string,
    subEntityType: string,
    process: string
  ): Observable<any> {
    return this.http.get(`${this.baseUrl}/entity-configs/media-types`, {
      params: { entityType, subEntityType, process },
    });
  }

  // --------------------- Media Upload / Management ---------------------
  validateMediaFile(formData: FormData, mediaTypeCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/validate`, formData, {
      params: { mediaTypeCode },
    });
  }

  uploadMedia(
    formData: FormData,
    mediaTypeCode: string,
    entityId: string,
    entityType: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      params: { mediaTypeCode, entityId, entityType },
    });
  }

  getMediaById(mediaId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${mediaId}`);
  }

  getAllMediaForEntity(entityId: string, entityType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/entity/${entityId}`, {
      params: { entityType },
    });
  }

  deleteMedia(mediaId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${mediaId}`);
  }
}
