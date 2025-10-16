import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authReq = authService.token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${authService.token}` } })
    : req;
  return next(authReq);
};
