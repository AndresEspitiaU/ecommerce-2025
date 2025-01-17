import { CustomNavData } from './custom-nav-data'; 

export const navItems: CustomNavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
    data: {
      permissions: ['VIEW_DASHBOARD'] // Permiso necesario para este ítem
    }
  },
  {
    name: 'Roles',
    url: '/roles',
    iconComponent: { name: 'cil-people' },
    data: {
      permissions: ['MANAGE_ROLES'] // Permiso necesario para ver Roles
    }
  },
  {
    name: 'Permissions',
    url: '/permissions',
    iconComponent: { name: 'cil-lock-locked' },
    data: {
      permissions: [ 'CREATE_PERMISSION', 'ASSIGN_PERMISSION', 'EDIT_PERMISSION', 'DELETE_PERMISSION'] // Permisos requeridos para la página
    },
  },
  {
    name: 'Categories',
    url: '/categories',
    iconComponent: { name: 'cil-list' },
    data: {
      permissions: ['VIEW_CATEGORIES'] // Permiso necesario para ver Categorías
    }
  },
  {
    name: 'Subcategories',
    url: '/subcategories',
    iconComponent: { name: 'cil-list' },
    data: {
      permissions: ['VIEW_SUBCATEGORIES'] // Permiso necesario para ver Subcategorías
    }
  }
  
  
];
