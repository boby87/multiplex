import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APP_CONFIG } from './config.token';
import { AppConfig } from './app.config';

export const AppConfigProvider: Provider = {
  provide: APP_CONFIG,
  useValue: environment as AppConfig,
};
