import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredPermissions = route.data['permissions'] as string[]; // Obtener permisos requeridos
    const userPermissions = this.authService.getUserPermissions(); // Obtener permisos del usuario
  
    console.log('Permisos requeridos:', requiredPermissions);
    console.log('Permisos del usuario:', userPermissions);
  
    if (requiredPermissions.every(permission => userPermissions.includes(permission))) {
      return true;
    } else {
      console.warn('Acceso denegado. Permisos insuficientes.');
      this.router.navigate(['/unauthorized']); // Redirigir si no tiene permisos
      return false;
    }
  }
  
}
