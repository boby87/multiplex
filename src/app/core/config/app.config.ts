export interface AppConfig {
  multiflexServerUrl: string;
  apiUrl: string;
  production: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    vpaidkey: string;
  };
}
