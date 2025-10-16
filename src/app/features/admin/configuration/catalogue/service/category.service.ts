import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { ProductCategory } from '../../../../../shared/model/productCategory';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/products/categories`;
  private http = inject(HttpClient);

  /** GET category by ID */
  getById(id: string): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.baseUrl}`);
  }

  /** POST filter with pagination and conditions */
  filterCategories(page = 0): Observable<PaginatedResponse<ProductCategory>> {
    const body = {
      page,
      size: 100,
      sort: [{ field: 'code', direction: 'desc' }],
      filters: {},
    };
    return this.http.post<PaginatedResponse<ProductCategory>>(`${this.baseUrl}/filters`, body);
  }

  /** POST create a new category */
  createCategory(category: ProductCategory): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(this.baseUrl, category);
  }

  /** PUT update a category */
  updateCategory(categoryId: string, category: ProductCategory): Observable<ProductCategory> {
    return this.http.put<ProductCategory>(`${this.baseUrl}/${categoryId}`, {
      ...category,
      productCategoryId: categoryId,
    });
  }
}
