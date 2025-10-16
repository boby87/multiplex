import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppConfigProvider } from './core/config/app.config.provider';
import { loaderInterceptor } from './core/interceptor/loader.interceptor';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { retryInterceptor } from './core/interceptor/retry.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { provideToastr } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { successInterceptor } from './core/interceptor/success.interceptor';

initializeApp(environment.firebase);

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    AppConfigProvider,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        loaderInterceptor,
        authInterceptor,
        retryInterceptor,
        errorInterceptor,
        successInterceptor,
      ])
    ),
    { provide: MAT_DIALOG_DATA, useValue: {} },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
    }),
    provideAnimations(),
  ],
};
