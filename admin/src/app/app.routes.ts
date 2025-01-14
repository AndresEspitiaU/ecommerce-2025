import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then(m => m.routes),
        canActivate: [PermissionsGuard], // Agregar el guard de permisos
        data: {
          permissions: ['VIEW_DASHBOARD'] // Permisos necesarios
        }
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./views/roles/roles.routes').then((m) => m.routes),
        canActivate: [PermissionsGuard],
        data: {
          permissions: ['MANAGE_ROLES']
        }
      },
      {
        path: 'permissions',
        loadChildren: () =>
          import('./views/permissions/permissions.routes').then((m) => m.routes),
        canActivate: [PermissionsGuard],
        data: {
          permissions: ['MANAGE_PERMISSIONS']
        }
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./views/pages/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
        data: {
          title: 'Acceso no autorizado',
        },
      },
    ]
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
