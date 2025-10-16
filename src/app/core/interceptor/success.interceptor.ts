import { inject } from '@angular/core';
import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../service/loader.service';
import { finalize } from 'rxjs';

export const successInterceptor: HttpInterceptorFn = (req, next) => {
  const toastController = inject(ToastrService);
  const loader = inject(LoaderService);
  const shouldNotify = req.headers.get('X-Notify') === 'true';
  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      if (!shouldNotify && event instanceof HttpResponse && event.status === 200) {
        const message = event.body?.message || 'Requête effectuée avec succès !';
        toastController.success(message);
      }
    }),
    finalize(() => loader.hide())
  );
};
