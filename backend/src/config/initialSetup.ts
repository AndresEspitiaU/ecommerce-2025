// src/config/initialSetup.ts
import { RoleService } from '../services/role.service';

export const rolesBase = [
  {
    nombre: "SUPER_ADMIN",
    descripcion: "Control total del sistema"
  },
  {
    nombre: "ADMIN",
    descripcion: "Administrador de la tienda"
  },
  {
    nombre: "VENDEDOR",
    descripcion: "Gestión de productos y pedidos"
  },
  {
    nombre: "CLIENTE",
    descripcion: "Usuario comprador"
  },
  {
    nombre: "SOPORTE",
    descripcion: "Atención al cliente"
  }
] as const;

// Definir interfaces para los tipos
interface Permiso {
  nombre: string;
  codigo: string;
  modulo: string;
}

type ModulosPermisos = 'PRODUCTOS' | 'PEDIDOS' | 'USUARIOS' | 'CLIENTES';

type PermisosConfig = Record<ModulosPermisos, Permiso[]>;

export const permisos: PermisosConfig = {
  PRODUCTOS: [
    { nombre: "Ver Productos", codigo: "READ_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Crear Productos", codigo: "CREATE_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Editar Productos", codigo: "UPDATE_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Eliminar Productos", codigo: "DELETE_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Gestionar Stock", codigo: "MANAGE_STOCK", modulo: "PRODUCTOS" }
  ],
  PEDIDOS: [
    { nombre: "Ver Pedidos", codigo: "READ_ORDERS", modulo: "PEDIDOS" },
    { nombre: "Crear Pedidos", codigo: "CREATE_ORDERS", modulo: "PEDIDOS" },
    { nombre: "Actualizar Pedidos", codigo: "UPDATE_ORDERS", modulo: "PEDIDOS" },
    { nombre: "Cancelar Pedidos", codigo: "CANCEL_ORDERS", modulo: "PEDIDOS" },
    { nombre: "Gestionar Devoluciones", codigo: "MANAGE_RETURNS", modulo: "PEDIDOS" }
  ],
  USUARIOS: [
    { nombre: "Ver Usuarios", codigo: "READ_USERS", modulo: "USUARIOS" },
    { nombre: "Crear Usuarios", codigo: "CREATE_USERS", modulo: "USUARIOS" },
    { nombre: "Editar Usuarios", codigo: "UPDATE_USERS", modulo: "USUARIOS" },
    { nombre: "Eliminar Usuarios", codigo: "DELETE_USERS", modulo: "USUARIOS" },
    { nombre: "Gestionar Roles", codigo: "MANAGE_ROLES", modulo: "USUARIOS" }
  ],
  CLIENTES: [
    { nombre: "Ver Perfil", codigo: "READ_PROFILE", modulo: "CLIENTES" },
    { nombre: "Editar Perfil", codigo: "UPDATE_PROFILE", modulo: "CLIENTES" },
    { nombre: "Ver Historial", codigo: "VIEW_HISTORY", modulo: "CLIENTES" },
    { nombre: "Gestionar Carrito", codigo: "MANAGE_CART", modulo: "CLIENTES" }
  ]
};

export const setupRolesYPermisos = async () => {
  try {
    // Crear roles base
    for (const rol of rolesBase) {
      await RoleService.createRole(rol);
    }

    // Crear permisos
    const modulosPermisos = Object.keys(permisos) as ModulosPermisos[];
    for (const modulo of modulosPermisos) {
      for (const permiso of permisos[modulo]) {
        await RoleService.createPermission(permiso);
      }
    }

    // Asignar permisos a roles
    await setupPermisosRoles();

    console.log('✅ Roles y permisos iniciales creados correctamente');
  } catch (error) {
    console.error('❌ Error al crear roles y permisos iniciales:', error);
  }
};

// Definir tipo para el mapeo de roles a permisos
type RolPermisos = Record<(typeof rolesBase)[number]['nombre'], string[]>;

const setupPermisosRoles = async () => {
  // Definir los permisos para cada rol
  const rolPermisos: RolPermisos = {
    SUPER_ADMIN: Object.values(permisos).flat().map(p => p.codigo),
    ADMIN: [
      "READ_PRODUCTS", "CREATE_PRODUCTS", "UPDATE_PRODUCTS", "DELETE_PRODUCTS",
      "READ_ORDERS", "UPDATE_ORDERS", "CANCEL_ORDERS",
      "READ_USERS", "UPDATE_USERS"
    ],
    VENDEDOR: [
      "READ_PRODUCTS", "CREATE_PRODUCTS", "UPDATE_PRODUCTS", "MANAGE_STOCK",
      "READ_ORDERS", "UPDATE_ORDERS"
    ],
    SOPORTE: [
      "READ_PRODUCTS", "READ_ORDERS", "UPDATE_ORDERS", "MANAGE_RETURNS"
    ],
    CLIENTE: [
      "READ_PROFILE", "UPDATE_PROFILE", "VIEW_HISTORY", "MANAGE_CART"
    ]
  };

  // Asignar los permisos a cada rol
  for (const [rolNombre, codigosPermisos] of Object.entries(rolPermisos)) {
    const roles = await RoleService.getRoles();
    const rol = roles.find(r => r.Nombre === rolNombre);

    if (rol) {
      for (const codigo of codigosPermisos) {
        await RoleService.assignPermissionToRole({
          rolId: rol.RolID,
          permisoId: parseInt(codigo), // Asegúrate de que el permisoId sea un número
          asignadoPor: 1 // ID del usuario administrador o sistema
        });
      }
    }
  }
};