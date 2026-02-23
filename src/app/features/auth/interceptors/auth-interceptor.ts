import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  if (!auth.currentUser) {
    return next(req);
  }

  return from(auth.currentUser.getIdToken()).pipe(
    switchMap(token => {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next(clonedRequest);
    })
  );
};