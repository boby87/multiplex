import { inject, Injectable, signal } from '@angular/core';
import { APP_CONFIG } from '../config/config.token';
import { AppConfig } from '../config/app.config';
import { fromEvent, merge, mergeMap, Observable, startWith, switchMap, tap, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AuthResponse,
  DecodedToken,
  UserContext,
  UserLogin,
  UserSession,
} from '../../shared/model/user';
import { getValueOrEmpty } from '../../shared/utility/fonction';

const decodeToken = (token: string): DecodedToken => {
  return JSON.parse(atob(token.split('.')[1]));
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private config = inject<AppConfig>(APP_CONFIG);
  private http = inject(HttpClient);

  private authResponseSignal = signal<AuthResponse>({});
  private menus = signal<any[]>([]);
  private userContextSignal = signal<UserContext>({
    userId: '',
    email: '',
    phone: '',
    username: '',
    fullName: '',
  });
  private _isLoggedIn = signal<boolean>(false);
  private userId!: string;

  login(user: UserLogin) {
    return this.http
      .post<AuthResponse>(`${this.config.multiflexServerUrl}/login`, user, {
        headers: { 'X-Notify': 'true' },
      })
      .pipe(
        tap(authResponse => {
          this.authResponseSignal.set(authResponse);
          this.userId = decodeToken(this.token).preferred_username || '';
          this.userContextSignal.set({
            email: getValueOrEmpty(decodeToken(this.token).email),
            phone: getValueOrEmpty(decodeToken(this.token).phone),
          });
        }),
        mergeMap(() => this.getUserContext()),
        tap(userContextBase64 => {
          const userSession = JSON.parse(atob(userContextBase64)) as UserSession;
          console.log(userSession);
          this.userContextSignal.set(userSession.userContext);
          this.menus.set(userSession.menuContext.menus);
          this._isLoggedIn.set(true);
        })
      );
  }

  getUserContext(): Observable<string> {
    return this.http.get<string>(
      `${this.config.multiflexServerUrl}/uaa-service/users/${this.userId}/context`,
      {
        responseType: 'text' as 'json',
        headers: { 'X-Notify': 'true' },
      }
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(
      `${this.config.multiflexServerUrl}/uaa-service/${this.userId}/refreshToken`,
      { refreshToken: this.authResponseSignal().refreshToken },
      { headers: { 'X-Notify': 'true' } }
    );
  }

  set refreshTokenAuth(token: any) {
    this.authResponseSignal.set(token);
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      `${this.config.multiflexServerUrl}/uaa-service/${this.userId}/logout`,
      { refreshToken: this.authResponseSignal().refreshToken }
    );
  }

  get token(): string {
    return this.authResponseSignal().token || '';
  }
  get requiresOtp(): boolean {
    return this.authResponseSignal().requiresOtp || false;
  }

  get userContext(): UserContext {
    return this.userContextSignal();
  }

  isLoggedIn() {
    return this._isLoggedIn();
  }

  get menus$() {
    return this.menus();
  }
}
