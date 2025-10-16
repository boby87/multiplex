import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../config/app.config';
import { AuthResponse, UserLogin } from '../../shared/model/user';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: jest.Mocked<HttpClient>;
  const mockConfig: AppConfig = {
    multiflexServerUrl: 'https://api.example.com',
  } as AppConfig;

  beforeEach(() => {
    httpMock = {
      post: jest.fn(),
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    // simulate Angular inject() manually
    jest.mock('@angular/core', () => ({
      ...jest.requireActual('@angular/core'),
      inject: (token: any) => {
        if (token === HttpClient) return httpMock;
        if (token.toString().includes('APP_CONFIG')) return mockConfig;
        return null;
      },
    }));

    service = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login and set auth state and menus', done => {
    const fakeToken = btoa(JSON.stringify({ sub: 'user123' }));
    const authResponse: AuthResponse = {
      token: `header.${fakeToken}.signature`,
      refreshToken: 'refresh-token',
      requiresOtp: false,
    };

    const contextBase64 = btoa(JSON.stringify({ menus: ['menu1', 'menu2'] }));

    httpMock.post.mockImplementationOnce(() => of(authResponse));
    httpMock.get.mockImplementationOnce(() => of(contextBase64));

    service.login({ username: 'test', password: 'pass' } as UserLogin).subscribe(() => {
      expect(httpMock.post).toHaveBeenCalledWith('https://api.example.com/login', {
        username: 'test',
        password: 'pass',
      });
      expect(httpMock.get).toHaveBeenCalledWith(
        'https://api.example.com/uaa-service/users/user123/context'
      );
      expect(service.token).toBe(authResponse.token);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.menus$).toEqual(['menu1', 'menu2']);
      done();
    });
  });

  it('should call refreshToken with correct data', () => {
    const authResponse: AuthResponse = {
      token: 'token',
      refreshToken: 'refresh-token',
      requiresOtp: false,
    };
    (service as any).authResponseSignal.set(authResponse);
    (service as any).userId = 'user123';

    httpMock.post.mockReturnValue(of({}));

    service.refreshToken().subscribe(() => {
      expect(httpMock.post).toHaveBeenCalledWith(
        'https://api.example.com/uaa-service/user123/refreshToken',
        { refreshToken: 'refresh-token' }
      );
    });
  });

  it('should call logout with correct data', () => {
    const authResponse: AuthResponse = {
      token: 'token',
      refreshToken: 'refresh-token',
      requiresOtp: false,
    };
    (service as any).authResponseSignal.set(authResponse);
    (service as any).userId = 'user123';

    httpMock.post.mockReturnValue(of({}));

    service.logout().subscribe(() => {
      expect(httpMock.post).toHaveBeenCalledWith(
        'https://api.example.com/uaa-service/user123/logout',
        { refreshToken: 'refresh-token' }
      );
    });
  });
});
