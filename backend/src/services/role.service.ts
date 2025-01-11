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
        Descripcion: rolData.descripcion
      });

      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteRole(rolId: number) {
    try {
      await db.query(`
        UPDATE Roles
        SET Activo = 0
        WHERE RolID = @RolID
      `, { RolID: rolId });
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
  static async assignPermissionToRole(rolID: number, permisoID: number) {
    await db.query(`
      INSERT INTO RolesPermisos (RolID, PermisoID)
      VALUES (@rolID, @permisoID)
    `, { rolID, permisoID });
  }

  static async removePermissionFromRole(rolId: number, permisoId: number) {
    try {
      await db.query(`
        DELETE FROM RolesPermisos
        WHERE RolID = @RolID AND PermisoID = @PermisoID
      `, {
        RolID: rolId,
        PermisoID: permisoId
      });
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

  // Consultas específicas
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

  static async hasPermission(usuarioId: number, permisoCodigo: string): Promise<boolean> {
    try {
      const permisos = await this.getUserPermissions(usuarioId);
      return permisos.some(p => p.Codigo === permisoCodigo);
    } catch (error) {
      throw error;
    }
  }

  static async hasRole(usuarioId: number, rolNombre: string): Promise<boolean> {
    try {
      const roles = await this.getUserRoles(usuarioId);
      return roles.some(r => r.Nombre === rolNombre);
    } catch (error) {
      throw error;
    }
  }
}