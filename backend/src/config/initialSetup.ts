// src/config/initialSetup.ts
import { RoleService } from '../services/role.service';
import { db } from '@/config/database';

// Definir los tipos
type ModuloPermiso = 'PRODUCTOS' | 'PEDIDOS' | 'USUARIOS' | 'CLIENTES' | 'CATEGORIAS';

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
    { nombre: "Eliminar Categorías", codigo: "DELETE_CATEGORIES", modulo: "CATEGORIAS" }
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
          const existingPermission = await db.query<{ codigo: string }>(`
            SELECT codigo
            FROM Permisos
            WHERE codigo = @codigo
          `, { codigo: permiso.codigo });

          if (existingPermission.length === 0) {
            // Insertar el permiso si no existe
            const permisoCreado = await RoleService.createPermission(permiso);
            permisosCreados.set(permiso.codigo, permisoCreado.PermisoID);
            console.log(`✅ Permiso ${permiso.codigo} creado correctamente`);
          } else {
            // console.log(`Permiso ${permiso.codigo} ya existe`);
          }
        } catch (error) {
          console.error(`Error creando permiso ${permiso.codigo}:`, error);
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
        "READ_CLIENTS", "CREATE_CLIENTS", "UPDATE_CLIENTS", "DELETE_CLIENTS", "DELETE_CATEGORIES"
      ],
      ADMIN: [
        "READ_PRODUCTS", "CREATE_PRODUCTS", "UPDATE_PRODUCTS", "DELETE_PRODUCTS", "MANAGE_STOCK",
        "READ_ORDERS", "CREATE_ORDERS", "UPDATE_ORDERS", "DELETE_ORDERS",
        "READ_USERS", "CREATE_USERS", "UPDATE_USERS", "DELETE_USERS"
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
              await RoleService.assignPermissionToRole(rolID, permisoID);
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