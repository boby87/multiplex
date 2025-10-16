import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (error, retryCount) => {
        if (shouldRetry(error.status)) {
          return timer(retryCount * 1000);
        }
        throw error;
      },
    }),
    catchError(err => {
      return throwError(() => err);
    })
  );
};

const shouldRetry = (status: number): boolean => [502, 503, 504].includes(status);
