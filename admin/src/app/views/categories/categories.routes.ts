import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionsGuard } from '../../guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['VIEW_CATEGORIES'],
    },
  },
  {
    path: 'create',
    component: CategoriesComponent, // Cambia esto si tienes un componente de creación específico
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['CREATE_CATEGORIES'],
    },
  },
  {
    path: 'edit/:id',
    component: CategoriesComponent, // Cambia esto si tienes un componente de edición específico
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['EDIT_CATEGORIES'],
    },
  },
  {
    path: 'delete/:id',
    component: CategoriesComponent, // Cambia esto si tienes un componente de eliminación específico
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['DELETE_CATEGORIES'],
    },
  }
];
