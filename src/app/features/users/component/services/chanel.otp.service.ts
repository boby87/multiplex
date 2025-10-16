import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../../core/config/app.config';
import { APP_CONFIG } from '../../../../core/config/config.token';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChanelOtpService {
  private config = inject<AppConfig>(APP_CONFIG);
  private http = inject(HttpClient);
  private baseUrl = `${this.config.multiflexServerUrl}/uaa-service`;

  otpRequest(userId: string, identifier: string, channel: string): Observable<any> {
    const url = `${this.baseUrl}/${userId}/otp/request`;
    const body = { identifier, language: 'fr', channel };
    return this.http.post(url, body, {
      responseType: 'text' as 'json',
    });
  }

  otpVerify(userId: string, identifier: string, submittedOtp: string): Observable<any> {
    const url = `${this.baseUrl}/${userId}/otp/verify`;
    const body = { identifier, submittedOtp, deviceToken: 'web', rememberMe: true };
    return this.http.post(url, body);
  }

  otpUnlock(userId: string, phoneNumber: string): Observable<any> {
    const url = `${this.baseUrl}/${userId}/otp/unlock`;
    const body = { phoneNumber };
    return this.http.post(url, body);
  }
}
