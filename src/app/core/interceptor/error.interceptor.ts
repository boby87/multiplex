import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../service/loader.service';

let retryCount = 0;
const MAX_RETRIES = 2;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notify = inject(ToastrService);
  const authService = inject(AuthService);
  const loader = inject(LoaderService);
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && retryCount < MAX_RETRIES) {
        retryCount++; // ⬅️ Incrémente les tentatives

        return authService.refreshToken().pipe(
          switchMap(authResponse => {
            authService.refreshTokenAuth(authResponse);
            retryCount = 0; // ⬅️ Réinitialise en cas de succès
            return next(req); // ⬅️ Rejoue la requête avec nouveau token
          }),
          catchError(err => {
            notify.error(err.error);
            retryCount = 0;
            void router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }

      if (error.status === 403) {
        notify.warning("Vous n'avez pas les droits nécessaires.");
      } else if (error.status === 400) {
        notify.error(error.error.message);
      } else if (error.status !== 400) {
        notify.error('Un problème est survenu. Veuillez rafraîchir la page ou réessayer');
      }

      return throwError(() => error);
    }),
    finalize(() => loader.hide())
  );
};
