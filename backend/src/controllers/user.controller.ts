// src/controllers/user.controller.ts
import { UserService } from '@/services/user.service';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

interface AssignRolesRequest {
  userId: number;
  roles: number[];
}

interface UpdateUserRequest {
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  genero?: string;
  estado?: string;
  idiomaPreferido?: string;
  zonaHoraria?: string;
}

export class UserController {
  // OBTENER TODOS LOS USUARIOS
  static getUsers: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const users = await UserService.getUsers(includeInactive);
      res.json(users);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({ 
        message: 'Error al obtener usuarios' 
      });
    }
  };

  // OBTENER UN USUARIO POR ID
  static getUserById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));
      
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({ 
        message: 'Error al obtener usuario' 
      });
    }
  };

  // ACTUALIZAR UN USUARIO
  static updateUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateUserRequest;

      const updatedUser = await UserService.updateUser(Number(id), updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      res.status(500).json({ 
        message: 'Error al actualizar usuario' 
      });
    }
  };

  // DESACTIVAR UN USUARIO
  static deactivateUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await UserService.deactivateUser(Number(id));
      res.json({ message: 'Usuario desactivado correctamente' });
    } catch (error) {
      console.error('Error desactivando usuario:', error);
      res.status(500).json({ 
        message: 'Error al desactivar usuario' 
      });
    }
  };

  // ELIMINAR UN USUARIO (SOFT DELETE)
  static deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await UserService.deleteUser(Number(id));
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      res.status(500).json({ 
        message: 'Error al eliminar usuario' 
      });
    }
  };

  // ASIGNAR ROLES A UN USUARIO
  static assignRolesToUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, roles } = req.body as AssignRolesRequest;

      if (!userId || !roles || !Array.isArray(roles)) {
        res.status(400).json({ 
          message: 'userId y roles son requeridos y roles debe ser un arreglo' 
        });
        return;
      }

      await UserService.assignRolesToUser(userId, roles);
      res.status(200).json({ 
        message: 'Roles asignados al usuario correctamente' 
      });
    } catch (error) {
      console.error('Error asignando roles al usuario:', error);
      res.status(500).json({ 
        message: 'Error asignando roles al usuario' 
      });
    }
  };

  // REMOVER ROLES DE UN USUARIO
  static removeRolesFromUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, roles } = req.body as AssignRolesRequest;

      if (!userId || !roles || !Array.isArray(roles)) {
        res.status(400).json({ 
          message: 'userId y roles son requeridos y roles debe ser un arreglo' 
        });
        return;
      }

      await UserService.removeRolesFromUser(userId, roles);
      res.status(200).json({ 
        message: 'Roles removidos del usuario correctamente' 
      });
    } catch (error) {
      console.error('Error removiendo roles del usuario:', error);
      res.status(500).json({ 
        message: 'Error removiendo roles del usuario' 
      });
    }
  };

  // CAMBIAR CONTRASEÑA
  static changePassword: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, currentPassword, newPassword } = req.body;

      if (!userId || !currentPassword || !newPassword) {
        res.status(400).json({ 
          message: 'Todos los campos son requeridos' 
        });
        return;
      }

      await UserService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      res.status(500).json({ 
        message: 'Error al cambiar la contraseña' 
      });
    }
  };

  // RESTABLECER CONTRASEÑA
  static resetPassword: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: 'Email es requerido' });
        return;
      }

      await UserService.resetPassword(email);
      res.json({ 
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña' 
      });
    } catch (error) {
      console.error('Error en proceso de reset password:', error);
      res.status(500).json({ 
        message: 'Error en el proceso de restablecimiento de contraseña' 
      });
    }
  };

  // VERIFICAR EMAIL
  static verifyEmail: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token } = req.params;

      await UserService.verifyEmail(token);
      res.json({ message: 'Email verificado correctamente' });
    } catch (error) {
      console.error('Error verificando email:', error);
      res.status(500).json({ 
        message: 'Error al verificar email' 
      });
    }
  };
}