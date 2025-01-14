import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { PermissionsGuard } from '../../guards/permission.guard';


export const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
    canActivate: [PermissionsGuard],
    data: {
      title: 'Gestión de Roles',
      permissions: ['MANAGE_ROLES'], // Permiso requerido para acceder
    },
  },
];
