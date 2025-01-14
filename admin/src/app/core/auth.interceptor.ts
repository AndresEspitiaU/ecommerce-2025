import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken'); // Asegúrate de que esta clave coincida con donde guardas el token.

    if (token) {
      // Clonar la solicitud y agregar el encabezado Authorization
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores 401 (Unauthorized)
        if (error.status === 401) {
          console.error('No autorizado, redirigiendo a /login...');
          this.router.navigate(['/login']); // Redirige al login si el token no es válido
        }
        return throwError(() => error); // Relanzar el error para que otros componentes puedan manejarlo si es necesario
      })
    );
  }
}
