import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AppConfig } from '../../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../../core/config/config.token';
import { Skill } from '../../../../../shared/model/skill';
import { PaginatedResponse } from '../../../../../shared/model/paginatedResponse';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private config = inject<AppConfig>(APP_CONFIG);
  private baseUrl = `${this.config.multiflexServerUrl}/onboarding-service/skills`;
  private http = inject(HttpClient);

  getAll(): Observable<PaginatedResponse<Skill>> {
    return this.http.get<PaginatedResponse<Skill>>(`${this.baseUrl}`, {headers: { 'X-Notify': 'true' } }).pipe(
      map(
        response =>
          ({
            ...response,
            content: (response as any)['items'],
          }) as PaginatedResponse<Skill>
      )
    );
  }

  // 🔹 Get paginated
  getPaginated(page = 0, size = 10): Observable<PaginatedResponse<Skill>> {
    const params = new HttpParams()
      .set('paginated', true)
      .set('page', page)
      .set('size', size)
      .set('sort', 'name,asc');
    return this.http.get<PaginatedResponse<Skill>>(this.baseUrl, { params });
  }

  // 🔹 Get by ID
  getById(skillId: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.baseUrl}/${skillId}`);
  }

  // 🔹 Get by name (exact match)
  getByName(skillName: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.baseUrl}/name/${skillName}`);
  }

  // 🔹 Filter by name
  filterByName(name: string, page = 0, size = 10): Observable<any> {
    const params = new HttpParams().set('name', name).set('page', page).set('size', size);
    return this.http.get<any>(`${this.baseUrl}/filter`, { params });
  }

  // 🔹 Filter by status
  filterByStatus(status: string, page = 0, size = 10): Observable<any> {
    const params = new HttpParams().set('status', status).set('page', page).set('size', size);
    return this.http.get<any>(`${this.baseUrl}/filter`, { params });
  }

  // 🔹 Filter by main
  filterByMain(main = true, page = 0, size = 10): Observable<any> {
    const params = new HttpParams().set('main', main).set('page', page).set('size', size);
    return this.http.get<any>(`${this.baseUrl}/filter`, { params });
  }

  // 🔹 Create skill
  create(skill: Skill): Observable<Skill> {
    skill.main = true;
    return this.http.post<Skill>(this.baseUrl, skill);
  }

  // 🔹 Update skill
  update(skillId: string, skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.baseUrl}/${skillId}`, skill);
  }

  // 🔹 Delete skill
  delete(skillId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${skillId}`);
  }
}
