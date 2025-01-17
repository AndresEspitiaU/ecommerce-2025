import { Routes } from '@angular/router';
import { SubcategoriesComponent } from './subcategories.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionsGuard } from '../../guards/permission.guard';

export const SubcategoryRoutes: Routes = [
  {
    path: '',
    component: SubcategoriesComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['VIEW_SUBCATEGORIES'], // Permiso necesario para ver subcategorías
    },
  },
  {
    path: 'create',
    component: SubcategoriesComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['CREATE_SUBCATEGORIES'], // Permiso necesario para crear subcategorías
    },
  },
  {
    path: 'edit/:id',
    component: SubcategoriesComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['UPDATE_SUBCATEGORIES'], // Permiso necesario para editar subcategorías
    },
   },
   {
    path: 'delete/:id',
    component: SubcategoriesComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    data: {
      permissions: ['DELETE_SUBCATEGORIES'], // Permiso necesario para eliminar subcategorías
    },
   }
];
