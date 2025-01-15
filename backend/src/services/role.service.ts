// src/services/role.service.ts
import { db } from '@/config/database';
import type { IRole, IPermiso, IRolPermiso, IUsuarioRol } from '@/types/role.types';
import sql from 'mssql';

export class RoleService {

  // METODO PARA CREAR UN ROL
  static async createRole(rolData: { nombre: string; descripcion?: string }) {
    try {
      const result = await db.query<IRole>(`
        INSERT INTO Roles (Nombre, Descripcion)
        OUTPUT INSERTED.*
        VALUES (@Nombre, @Descripcion)
      `, {
        Nombre: rolData.nombre,
        Descripcion: rolData.descripcion
      });

      return result[0];
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA OBTENER UN ROL POR ID
  static async getRoles(includeInactive: boolean = false) {
    try {
      const roles = await db.query<IRole>(`
        SELECT * FROM Roles
        ${!includeInactive ? 'WHERE Activo = 1' : ''}
        ORDER BY Nombre
      `);
      // console.log('Roles obtenidos del backend:', roles);
      return roles;
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA ACTUALIZAR UN ROL
  static async updateRole(rolId: number, rolData: { nombre: string; descripcion?: string }) {
    try {
      const result = await db.query<IRole>(`
        UPDATE Roles
        SET 
          Nombre = @Nombre,
          Descripcion = @Descripcion,
          FechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE RolID = @RolID
      `, {
        RolID: rolId,
        Nombre: rolData.nombre,
        Descripcion: rolData.descripcion,
      });
  
      return result[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA ELIMINAR UN ROL
  static async deleteRole(rolId: number): Promise<number> {
    try {
      const pool = await db.getConnection();
      const request = pool.request();
      request.input('RolID', sql.Int, rolId);

      const result = await request.query(`
        DELETE FROM Roles
        WHERE RolID = @RolID
      `);

      return result.rowsAffected[0] || 0; // Devuelve el número de filas afectadas
    } catch (error) {
      console.error('Error al eliminar el rol:', error);
      throw new Error('No se pudo eliminar el rol');
    }
  }

  // METODO PARA CREAR UN PERMISO
  static async createPermission(permisoData: {
    nombre: string;
    codigo: string;
    descripcion?: string;
    modulo: string;
  }) {
    try {
      const result = await db.query<IPermiso>(`
        INSERT INTO Permisos (Nombre, Codigo, Descripcion, Modulo)
        OUTPUT INSERTED.*
        VALUES (@Nombre, @Codigo, @Descripcion, @Modulo)
      `, {
        Nombre: permisoData.nombre,
        Codigo: permisoData.codigo,
        Descripcion: permisoData.descripcion,
        Modulo: permisoData.modulo
      });

      return result[0];
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA OBETENER TODOS LOS PERMISOS
  static async getPermissions(modulo?: string) {
    try {
      const permisos = await db.query<IPermiso>(`
        SELECT * FROM Permisos
        WHERE Activo = 1
        ${modulo ? 'AND Modulo = @Modulo' : ''}
        ORDER BY Modulo, Nombre
      `, modulo ? { Modulo: modulo } : {});

      return permisos;
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA ASIGNAR PERMISOS A UN ROL
  static async assignPermissionToRole(rolId: number, permisoId: number, asignadoPor: number): Promise<void> {
    try {
      await db.query(`
        INSERT INTO RolesPermisos (RolID, PermisoID, AsignadoPor)
        VALUES (@RolID, @PermisoID, @AsignadoPor)
      `, { RolID: rolId, PermisoID: permisoId, AsignadoPor: asignadoPor });
    } catch (error) {
      console.error('Error al asignar permiso al rol:', error);
      throw new Error('No se pudo asignar el permiso al rol');
    }
  }

  // METODO PARA REMOVER PERMISOS DE UN ROL
  static async removePermissionFromRole(rolId: number, permisoId: number): Promise<void> {
    try {
      await db.query(`
        DELETE FROM RolesPermisos
        WHERE RolID = @RolID AND PermisoID = @PermisoID
      `, { RolID: rolId, PermisoID: permisoId });
    } catch (error) {
      console.error('Error al eliminar permiso del rol:', error);
      throw new Error('No se pudo eliminar el permiso del rol');
    }
  }

  // METODO PARA OBTENER LOS PERMISOS DE UN ROL
  static async getPermissionsByRole(rolId: number): Promise<any[]> {
    try {
      return await db.query(`
        SELECT p.PermisoID, p.Nombre, p.Codigo, p.Descripcion, p.Modulo
        FROM Permisos p
        INNER JOIN RolesPermisos rp ON p.PermisoID = rp.PermisoID
        WHERE rp.RolID = @RolID
      `, { RolID: rolId });
    } catch (error) {
      console.error('Error al obtener permisos del rol:', error);
      throw new Error('No se pudieron obtener los permisos del rol');
    }
  }

  // METODO PARA ASIGNAR ROLES A UN USUARIO
  static async assignRoleToUser(data: {
    usuarioId: number;
    rolId: number;
    asignadoPor: number;
    fechaExpiracion?: Date;
  }) {
    try {
      // Verificar si ya existe la asignación
      const existing = await db.query<IUsuarioRol>(`
        SELECT * FROM UsuariosRoles
        WHERE UsuarioID = @UsuarioID AND RolID = @RolID AND Activo = 1
      `, {
        UsuarioID: data.usuarioId,
        RolID: data.rolId
      });

      if (existing.length > 0) {
        throw new Error('El usuario ya tiene asignado este rol');
      }

      const result = await db.query<IUsuarioRol>(`
        INSERT INTO UsuariosRoles (UsuarioID, RolID, AsignadoPor, FechaExpiracion)
        OUTPUT INSERTED.*
        VALUES (@UsuarioID, @RolID, @AsignadoPor, @FechaExpiracion)
      `, {
        UsuarioID: data.usuarioId,
        RolID: data.rolId,
        AsignadoPor: data.asignadoPor,
        FechaExpiracion: data.fechaExpiracion
      });

      return result[0];
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA REMOVER UN ROL DE UN USUARIO
  static async removeRoleFromUser(usuarioId: number, rolId: number) {
    try {
      await db.query(`
        UPDATE UsuariosRoles
        SET Activo = 0
        WHERE UsuarioID = @UsuarioID AND RolID = @RolID
      `, {
        UsuarioID: usuarioId,
        RolID: rolId
      });
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA OBTENER LOS PERMISOS DE UN ROL
  static async getRolePermissions(rolId: number) {
    try {
      const permisos = await db.query<IPermiso>(`
        SELECT p.*
        FROM Permisos p
        INNER JOIN RolesPermisos rp ON p.PermisoID = rp.PermisoID
        WHERE rp.RolID = @RolID AND p.Activo = 1
        ORDER BY p.Modulo, p.Nombre
      `, { RolID: rolId });

      return permisos;
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA OBTENER LOS PERMISOS DE UN USUARIO
  static async getUserPermissions(usuarioId: number) {
    try {
      const permisos = await db.query<IPermiso>(`
        SELECT DISTINCT p.*
        FROM Permisos p
        INNER JOIN RolesPermisos rp ON p.PermisoID = rp.PermisoID
        INNER JOIN UsuariosRoles ur ON rp.RolID = ur.RolID
        WHERE ur.UsuarioID = @UsuarioID
        AND ur.Activo = 1
        AND (ur.FechaExpiracion IS NULL OR ur.FechaExpiracion > GETDATE())
        AND p.Activo = 1
      `, { UsuarioID: usuarioId });

      return permisos;
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA OBTENER LOS ROLES DE UN USUARIO
  static async getUserRoles(usuarioId: number) {
    try {
      const roles = await db.query<IRole>(`
        SELECT r.*
        FROM Roles r
        INNER JOIN UsuariosRoles ur ON r.RolID = ur.RolID
        WHERE ur.UsuarioID = @UsuarioID
        AND ur.Activo = 1
        AND (ur.FechaExpiracion IS NULL OR ur.FechaExpiracion > GETDATE())
        AND r.Activo = 1
      `, { UsuarioID: usuarioId });

      return roles;
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA VERIFICAR SI UN USUARIO TIENE UN PERMISO
  static async hasPermission(usuarioId: number, permisoCodigo: string): Promise<boolean> {
    try {
      const permisos = await this.getUserPermissions(usuarioId);
      return permisos.some(p => p.Codigo === permisoCodigo);
    } catch (error) {
      throw error;
    }
  }

  // METODO PARA VERIFICAR SI UN USUARIO TIENE UN ROL
  static async hasRole(usuarioId: number, rolNombre: string): Promise<boolean> {
    try {
      const roles = await this.getUserRoles(usuarioId);
      return roles.some(r => r.Nombre === rolNombre);
    } catch (error) {
      throw error;
    }
  }
}