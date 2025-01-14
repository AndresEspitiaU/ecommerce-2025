import { Routes } from '@angular/router';
import { PermissionsComponent } from './permissions.component';
import { PermissionsGuard } from '../../guards/permission.guard';


export const routes: Routes = [
  {
    path: '',
    component: PermissionsComponent,
    canActivate: [PermissionsGuard],
    data: {
      title: 'Gestión de Permisos',
      permissions: ['MANAGE_PERMISSIONS'], // Permiso requerido para acceder
    },
  },
];
