// src/services/user.service.ts
import { db } from '@/config/database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { IUser } from '@/types/user.types';

interface UpdateUserData {
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  genero?: string;
  estado?: string;
  idiomaPreferido?: string;
  zonaHoraria?: string;
}

export class UserService {
  
  // Obtener todos los usuarios
  static async getUsers(includeInactive: boolean = false) {
    try {
      const users = await db.query<IUser>(`
        SELECT 
          UsuarioID, Email, Nombres, Apellidos, NombreUsuario,
          Telefono, FechaNacimiento, Genero, Estado,
          EmailConfirmado, IdiomaPreferido, ZonaHoraria,
          FechaCreacion, UltimoAcceso
        FROM Usuarios
        WHERE Eliminado = 0
        ${!includeInactive ? 'AND Activo = 1' : ''}
        ORDER BY FechaCreacion DESC
      `);

      return users;
    } catch (error) {
      throw new Error('Error al obtener usuarios');
    }
  }

  // Obtener un usuario por ID
  static async getUserById(userId: number) {
    try {
      const users = await db.query<IUser>(`
        SELECT 
          UsuarioID, Email, Nombres, Apellidos, NombreUsuario,
          Telefono, FechaNacimiento, Genero, Estado,
          EmailConfirmado, IdiomaPreferido, ZonaHoraria,
          FechaCreacion, UltimoAcceso
        FROM Usuarios
        WHERE UsuarioID = @userId AND Eliminado = 0
      `, { userId });

      return users[0];
    } catch (error) {
      throw new Error('Error al obtener usuario');
    }
  }

  // Actualizar un usuario
  static async updateUser(userId: number, updateData: UpdateUserData) {
    try {
      // Construir query dinámica
      const updateFields = Object.entries(updateData)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key} = @${key}`);

      if (updateFields.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      const users = await db.query<IUser>(`
        UPDATE Usuarios
        SET 
          ${updateFields.join(', ')},
          FechaActualizacion = GETDATE()
        OUTPUT 
          INSERTED.UsuarioID, INSERTED.Email, INSERTED.Nombres,
          INSERTED.Apellidos, INSERTED.NombreUsuario
        WHERE UsuarioID = @userId AND Eliminado = 0
      `, { userId, ...updateData });

      return users[0];
    } catch (error) {
      throw new Error('Error al actualizar usuario');
    }
  }

  // Desactivar un usuario
  static async deactivateUser(userId: number) {
    try {
      await db.query(`
        UPDATE Usuarios
        SET 
          Activo = 0,
          FechaActualizacion = GETDATE()
        WHERE UsuarioID = @userId AND Eliminado = 0
      `, { userId });
    } catch (error) {
      throw new Error('Error al desactivar usuario');
    }
  }

  // Eliminar un usuario (soft delete)
  static async deleteUser(userId: number) {
    try {
      await db.query(`
        UPDATE Usuarios
        SET 
          Eliminado = 1,
          FechaEliminacion = GETDATE(),
          FechaActualizacion = GETDATE()
        WHERE UsuarioID = @userId
      `, { userId });
    } catch (error) {
      throw new Error('Error al eliminar usuario');
    }
  }

  // Asignar roles a un usuario
  static async assignRolesToUser(userId: number, roleIds: number[]) {
    try {
      // Verificar que el usuario existe
      const userExists = await db.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM Usuarios WHERE UsuarioID = @UsuarioID AND Eliminado = 0',
        { UsuarioID: userId }
      );

      if (!userExists.length || userExists[0].count === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que los roles existen
      const rolesPlaceholders = roleIds.map((_, i) => `@RoleId${i}`).join(',');
      const rolesParams: Record<string, any> = {};
      roleIds.forEach((roleId, i) => {
        rolesParams[`RoleId${i}`] = roleId;
      });

      const validRoles = await db.query<{ RolID: number }>(
        `SELECT RolID FROM Roles WHERE RolID IN (${rolesPlaceholders}) AND Activo = 1`,
        rolesParams
      );

      if (validRoles.length !== roleIds.length) {
        throw new Error('Algunos roles no son válidos');
      }

      // Desactivar roles existentes
      await db.query(
        'UPDATE UsuariosRoles SET Activo = 0 WHERE UsuarioID = @UsuarioID',
        { UsuarioID: userId }
      );

      // Insertar nuevos roles
      const insertPromises = roleIds.map(rolId => 
        db.query(
          `INSERT INTO UsuariosRoles (
            UsuarioID, 
            RolID, 
            FechaAsignacion, 
            Activo
          ) VALUES (
            @UsuarioID, 
            @RolID, 
            GETDATE(), 
            1
          )`,
          {
            UsuarioID: userId,
            RolID: rolId
          }
        )
      );

      await Promise.all(insertPromises);

      return {
        success: true,
        message: 'Roles asignados correctamente'
      };
    } catch (error) {
      console.error('Error en assignRolesToUser:', error);
      throw error;
    }
  }

  // Remover roles de un usuario
  static async removeRolesFromUser(userId: number, roleIds: number[]) {
    try {
      await db.query(`
        UPDATE UsuariosRoles
        SET 
          Activo = 0,
          FechaActualizacion = GETDATE()
        WHERE UsuarioID = @userId 
        AND RolID IN (${roleIds.join(',')})
      `, { userId });
    } catch (error) {
      throw new Error('Error al remover roles del usuario');
    }
  }

  // Cambiar contraseña
  static async changePassword(userId: number, currentPassword: string, newPassword: string) {
    try {
      // Obtener usuario y verificar contraseña actual
      const users = await db.query<{ Contraseña: string; SaltContraseña: string }>(`
        SELECT Contraseña, SaltContraseña
        FROM Usuarios
        WHERE UsuarioID = @userId AND Eliminado = 0
      `, { userId });

      if (users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const user = users[0];
      const isValid = await bcrypt.compare(currentPassword + user.SaltContraseña, user.Contraseña);
      
      if (!isValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Generar nuevo hash y salt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword + salt, 10);

      // Actualizar contraseña
      await db.query(`
        UPDATE Usuarios
        SET 
          Contraseña = @hashedPassword,
          SaltContraseña = @salt,
          UltimoCambioContraseña = GETDATE(),
          FechaActualizacion = GETDATE()
        WHERE UsuarioID = @userId
      `, { 
        userId, 
        hashedPassword, 
        salt 
      });
    } catch (error) {
      throw error;
    }
  }

  // Restablecer contraseña
  static async resetPassword(email: string) {
    try {
      // Generar token de recuperación
      const token = crypto.randomBytes(32).toString('hex');
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24); // Token válido por 24 horas

      await db.query(`
        UPDATE Usuarios
        SET 
          TokenRecuperacion = @token,
          VenceTokenRecuperacion = @expiration,
          FechaActualizacion = GETDATE()
        WHERE Email = @email AND Eliminado = 0
      `, { 
        email, 
        token, 
        expiration 
      });

      // TODO: Enviar email con el token
    } catch (error) {
      throw new Error('Error al procesar solicitud de recuperación de contraseña');
    }
  }

  // Verificar email
  static async verifyEmail(token: string) {
    try {
      const result = await db.query<{ UsuarioID: number }>(`
        UPDATE Usuarios
        SET 
          EmailConfirmado = 1,
          TokenVerificacion = NULL,
          FechaActualizacion = GETDATE()
        OUTPUT INSERTED.UsuarioID
        WHERE TokenVerificacion = @token AND Eliminado = 0
      `, { token });

      if (result.length === 0) {
        throw new Error('Token de verificación inválido o expirado');
      }
    } catch (error) {
      throw new Error('Error al verificar email');
    }
  }
}