// src/services/role.service.ts
import { db } from '@/config/database';
import type { IRole, IPermiso, IRolPermiso, IUsuarioRol } from '@/types/role.types';

export class RoleService {
  // Roles
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

  static async getRoles(includeInactive: boolean = false) {
    try {
      const roles = await db.query<IRole>(`
        SELECT * FROM Roles
        ${!includeInactive ? 'WHERE Activo = 1' : ''}
        ORDER BY Nombre
      `);

      return roles;
    } catch (error) {
      throw error;
    }
  }

  // Permisos
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

  // Asignación de permisos a roles
  static async assignPermissionToRole(data: {
    rolId: number;
    permisoId: number;
    asignadoPor: number;
  }) {
    try {
      const result = await db.query<IRolPermiso>(`
        INSERT INTO RolesPermisos (RolID, PermisoID, AsignadoPor)
        OUTPUT INSERTED.*
        VALUES (@RolID, @PermisoID, @AsignadoPor)
      `, {
        RolID: data.rolId,
        PermisoID: data.permisoId,
        AsignadoPor: data.asignadoPor
      });

      return result[0];
    } catch (error) {
      throw error;
    }
  }

  // Asignación de roles a usuarios
  static async assignRoleToUser(data: {
    usuarioId: number;
    rolId: number;
    asignadoPor: number;
    fechaExpiracion?: Date;
  }) {
    try {
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

  // Verificar permisos de usuario
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

  // Verificar roles de usuario
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
}