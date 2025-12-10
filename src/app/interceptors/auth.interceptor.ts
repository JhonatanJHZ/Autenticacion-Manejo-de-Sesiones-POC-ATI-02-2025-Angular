import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // No agregar token a las rutas de autenticación
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh') ||
    req.url.includes('/public/');

  if (isAuthEndpoint) {
    return next(req);
  }

  // Agregar el Bearer Token a las peticiones
  const token = authService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 (Unauthorized) o 403 (Forbidden), intentar refrescar el token
      if (error.status === 401 || error.status === 403) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken && !req.url.includes('/auth/refresh')) {
          // Intentar refrescar el token
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Reintentar la petición original con el nuevo token
              const newToken = authService.getAccessToken();
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next(clonedReq);
            }),
            catchError((refreshError) => {
              // Si falla el refresh, cerrar sesión y redirigir al login
              console.error('Error al refrescar el token:', refreshError);
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // No hay refresh token, redirigir al login
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
