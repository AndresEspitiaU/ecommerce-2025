// src/config/initialSetup.ts
import { RoleService } from '../services/role.service';
import { db } from '@/config/database';

// Definir los tipos
type ModuloPermiso = 'PRODUCTOS' | 'PEDIDOS' | 'USUARIOS' | 'CLIENTES' | 'CATEGORIAS' | 'PERMISOS' | 'ROLES' | 'SUBCATEGORIAS';

interface Permiso {
  nombre: string;
  codigo: string;
  descripcion?: string;
  modulo: ModuloPermiso;
}

interface PermisosConfig {
  PRODUCTOS: Permiso[];
  CATEGORIAS: Permiso[];
  PEDIDOS: Permiso[];
  USUARIOS: Permiso[];
  CLIENTES: Permiso[];
  PERMISOS: Permiso[];
  ROLES: Permiso[];
  SUBCATEGORIAS: Permiso[];
}

interface RolBase {
  nombre: string;
  descripcion: string;
}

export const rolesBase: RolBase[] = [
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
];

export const permisos: PermisosConfig = {
  PRODUCTOS: [
    { nombre: "Ver Productos", codigo: "READ_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Crear Productos", codigo: "CREATE_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Editar Productos", codigo: "UPDATE_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Eliminar Productos", codigo: "DELETE_PRODUCTS", modulo: "PRODUCTOS" },
    { nombre: "Gestionar Stock", codigo: "MANAGE_STOCK", modulo: "PRODUCTOS" }
  ],
  CATEGORIAS: [
    { nombre: "Ver Categorías", codigo: "VIEW_CATEGORIES", modulo: "CATEGORIAS" },
    { nombre: "Crear Categorías", codigo: "CREATE_CATEGORIES", modulo: "CATEGORIAS" },
    { nombre: "Editar Categorías", codigo: "EDIT_CATEGORIES", modulo: "CATEGORIAS" },
    { nombre: "Eliminar Categorías", codigo: "DELETE_CATEGORIES", modulo: "CATEGORIAS" },
  ],
  PEDIDOS: [
    { nombre: "Ver Pedidos", codigo: "READ_ORDERS", modulo: "PEDIDOS" },
    { nombre: "Crear Pedidos", codigo: "CREATE_ORDERS", modulo: "PEDIDOS" },
    { nombre: "Editar Pedidos", codigo: "UPDATE_ORDERS", modulo: "PEDIDOS" },
    { nombre: "Eliminar Pedidos", codigo: "DELETE_ORDERS", modulo: "PEDIDOS" }
  ],
  USUARIOS: [
    { nombre: "Ver Usuarios", codigo: "READ_USERS", modulo: "USUARIOS" },
    { nombre: "Crear Usuarios", codigo: "CREATE_USERS", modulo: "USUARIOS" },
    { nombre: "Editar Usuarios", codigo: "UPDATE_USERS", modulo: "USUARIOS" },
    { nombre: "Eliminar Usuarios", codigo: "DELETE_USERS", modulo: "USUARIOS" }
  ],
  CLIENTES: [
    { nombre: "Ver Clientes", codigo: "READ_CLIENTS", modulo: "CLIENTES" },
    { nombre: "Crear Clientes", codigo: "CREATE_CLIENTS", modulo: "CLIENTES" },
    { nombre: "Editar Clientes", codigo: "UPDATE_CLIENTS", modulo: "CLIENTES" },
    { nombre: "Eliminar Clientes", codigo: "DELETE_CLIENTS", modulo: "CLIENTES" }
  ],
  PERMISOS: [ 
    { nombre: "Gestionar Permisos", codigo: "MANAGE_PERMISSIONS", modulo: "PERMISOS" },
    { nombre: "Crear Permiso", codigo: "CREATE_PERMISSION", modulo: "PERMISOS" },
    { nombre: "Asignar Permiso", codigo: "ASSIGN_PERMISSION", modulo: "PERMISOS" },
    { nombre: "Editar Permiso", codigo: "EDIT_PERMISSION", modulo: "PERMISOS" },
    { nombre: "Eliminar Permiso", codigo: "DELETE_PERMISSION", modulo: "PERMISOS" }
  ],
  ROLES: [
    { nombre: 'Ver Permisos de Rol', codigo: 'VIEW_ROLE_PERMISSIONS', modulo: 'ROLES' },
    { nombre: "Ver Roles", codigo: "VIEW_ROLES", modulo: "ROLES" },
    { nombre: "Crear Roles", codigo: "CREATE_ROLES", modulo: "ROLES" },
    { nombre: "Editar Roles", codigo: "EDIT_ROLES", modulo: "ROLES" },
    { nombre: "Eliminar Roles", codigo: "DELETE_ROLES", modulo: "ROLES" },
    { nombre: "Gestionar Permisos de Roles", codigo: "MANAGE_ROLE_PERMISSIONS", modulo: "ROLES" },
  ],
  SUBCATEGORIAS: [
    { nombre: "Ver Subcategorías", codigo: "VIEW_SUBCATEGORIES", modulo: "SUBCATEGORIAS" },
    { nombre: "Crear Subcategorías", codigo: "CREATE_SUBCATEGORIES", modulo: "SUBCATEGORIAS" },
    { nombre: "Editar Subcategorías", codigo: "UPDATE_SUBCATEGORIES", modulo: "SUBCATEGORIAS" },
    { nombre: "Eliminar Subcategorías", codigo: "DELETE_SUBCATEGORIES", modulo: "SUBCATEGORIAS" }
  ]  
};

export const setupRolesYPermisos = async () => {
  try {
    // Crear roles base
    const rolesCreados = new Map<string, number>();
    for (const rol of rolesBase) {
      try {
        // Verificar si el rol ya existe
        const existingRole = await db.query<{ nombre: string }>(`
          SELECT nombre 
          FROM Roles 
          WHERE nombre = @nombre
        `, { nombre: rol.nombre });

        if (existingRole.length === 0) {
          // Insertar el rol si no existe
          const rolCreado = await RoleService.createRole(rol);
          rolesCreados.set(rol.nombre, rolCreado.RolID);
          console.log(`✅ Rol ${rol.nombre} creado correctamente`);
        } else {
          // console.log(`Rol ${rol.nombre} ya existe`);
        }
      } catch (error) {
        console.error(`Error creando rol ${rol.nombre}:`, error);
      }
    }

    // Crear permisos
    const permisosCreados = new Map<string, number>();
    const modulos = Object.keys(permisos) as ModuloPermiso[];

    for (const modulo of modulos) {
      for (const permiso of permisos[modulo]) {
        try {
          // Verificar si el permiso ya existe
          const [existingPermission] = await db.query<{ PermisoID: number; Codigo: string }>(`
            SELECT PermisoID, Codigo
            FROM Permisos
            WHERE Codigo = @Codigo
          `, { Codigo: permiso.codigo });

          if (!existingPermission) {
            // Insertar el permiso si no existe
            const permisoCreado = await RoleService.createPermission(permiso);
            permisosCreados.set(permiso.codigo, permisoCreado.PermisoID);
            console.log(`✅ Permiso ${permiso.codigo} creado correctamente`);
          } else {
            // El permiso ya existe
            permisosCreados.set(existingPermission.Codigo, existingPermission.PermisoID);
            // console.log(`⚠️ Permiso ${permiso.codigo} ya existe, se omitió su creación`);
          }
        } catch (error) {
          console.error(`❌ Error creando permiso ${permiso.codigo}:`, error);
        }
      }
    }



    // Definir las asignaciones de permisos por rol
    type RolesPermisos = {
      [key: string]: string[];
    };

    const rolesPermisos: RolesPermisos = {
      SUPER_ADMIN: [
        "READ_PRODUCTS", "CREATE_PRODUCTS", "UPDATE_PRODUCTS", "DELETE_PRODUCTS", "MANAGE_STOCK",
        "READ_ORDERS", "CREATE_ORDERS", "UPDATE_ORDERS", "DELETE_ORDERS",
        "READ_USERS", "CREATE_USERS", "UPDATE_USERS", "DELETE_USERS",
        "READ_CLIENTS", "CREATE_CLIENTS", "UPDATE_CLIENTS", "DELETE_CLIENTS", "DELETE_CATEGORIES",
        // Permisos de gestión de permisos
        "MANAGE_PERMISSIONS","CREATE_PERMISSION", "ASSIGN_PERMISSION", "EDIT_PERMISSION", "DELETE_PERMISSION", 
        // Roles
        "VIEW_ROLE_PERMISSIONS",
        // Categorías
        "VIEW_CATEGORIES", "CREATE_CATEGORIES", "EDIT_CATEGORIES", "DELETE_CATEGORIES",
        // Subcategorías
        "VIEW_SUBCATEGORIES", "CREATE_SUBCATEGORIES", "UPDATE_SUBCATEGORIES", "DELETE_SUBCATEGORIES"
      ],
      ADMIN: [
        "READ_PRODUCTS", "CREATE_PRODUCTS", "UPDATE_PRODUCTS", "DELETE_PRODUCTS", "MANAGE_STOCK",
        "READ_ORDERS", "CREATE_ORDERS", "UPDATE_ORDERS", "DELETE_ORDERS",
        "READ_USERS", "CREATE_USERS", "UPDATE_USERS", "DELETE_USERS",
        // Categorías
        "VIEW_CATEGORIES", "CREATE_CATEGORIES", "EDIT_CATEGORIES", "DELETE_CATEGORIES",
      ],
      VENDEDOR: [
        "READ_PRODUCTS", "CREATE_PRODUCTS", "UPDATE_PRODUCTS", "DELETE_PRODUCTS", "MANAGE_STOCK",
        "READ_ORDERS", "CREATE_ORDERS", "UPDATE_ORDERS", "DELETE_ORDERS"
      ],
      CLIENTE: [
        "READ_PRODUCTS", "READ_ORDERS", "CREATE_ORDERS"
      ],
      SOPORTE: [
        "READ_CLIENTS", "UPDATE_CLIENTS"
      ]
    };

    // Asignar permisos a roles
    for (const [rol, permisos] of Object.entries(rolesPermisos)) {
      const rolID = rolesCreados.get(rol);
      if (rolID) {
        for (const permiso of permisos) {
          const permisoID = permisosCreados.get(permiso);
          if (permisoID) {
            try {
              await RoleService.assignPermissionToRole(rolID, permisoID, 1);
              console.log(`✅ Permiso ${permiso} asignado al rol ${rol}`);
            } catch (error) {
              console.error(`Error asignando permiso ${permiso} al rol ${rol}:`, error);
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('Error en setupRolesYPermisos:', error);
  }
};

// Llamar a la función de configuración al iniciar la aplicación
setupRolesYPermisos().catch(console.error);