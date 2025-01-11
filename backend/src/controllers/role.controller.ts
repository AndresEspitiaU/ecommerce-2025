// src/controllers/role.controller.ts
// src/controllers/role.controller.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { RoleService } from '@/services/role.service';

interface RoleRequest {
  nombre: string;
  descripcion?: string;
}

interface PermissionRequest {
  nombre: string;
  codigo: string;
  descripcion?: string;
  modulo: string;
}

interface AssignPermissionRequest {
  rolId: number;
  permisoId: number;
}
interface AssignRolesRequest {
  userId: string;
  roles: string[];
}

export class RoleController {
  
  static assignRolesToUser: RequestHandler = async (
    req: Request<{}, {}, AssignRolesRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, roles } = req.body;

      if (!userId || !roles) {
        res.status(400).json({
          message: 'Faltan campos requeridos'
        });
        return;
      }

      const result = await Promise.all(
        roles.map(role => RoleService.assignRoleToUser({
          usuarioId: parseInt(userId, 10),
          rolId: parseInt(role, 10),
          asignadoPor: 1 // Aquí puedes poner el ID del usuario que asigna el rol
        }))
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Error al asignar roles:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al asignar roles'
      });
    }
  };

  // METODO PARA CREAR UN ROL
  static createRole: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { nombre, descripcion } = req.body as RoleRequest;
      if (!nombre) {
        res.status(400).json({ message: 'El nombre del rol es requerido' });
        return;
      }

      const role = await RoleService.createRole({ nombre, descripcion });
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al crear el rol'
      });
    }
  };

  // METODO PARA OBTENER LOS ROLES
  static getRoles: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const roles = await RoleService.getRoles(includeInactive);
      res.json(roles);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener los roles'
      });
    }
  };

  // METODO PARA ACTUALIZAR UN ROL
  static updateRole: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body as RoleRequest;

      if (!nombre) {
        res.status(400).json({ message: 'El nombre del rol es requerido' });
        return;
      }

      const role = await RoleService.updateRole(Number(id), { nombre, descripcion });
      res.json(role);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al actualizar el rol'
      });
    }
  };

  // METODO PARA ELIMINAR UN ROL
  static deleteRole: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await RoleService.deleteRole(Number(id));
      res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al eliminar el rol'
      });
    }
  };

  // METODO PARA CREAR UN PERMISO
  static createPermission: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { nombre, codigo, descripcion, modulo } = req.body as PermissionRequest;

      if (!nombre || !codigo || !modulo) {
        res.status(400).json({ 
          message: 'Nombre, código y módulo son requeridos' 
        });
        return;
      }

      const permission = await RoleService.createPermission({
        nombre,
        codigo,
        descripcion,
        modulo
      });
      res.status(201).json(permission);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al crear el permiso'
      });
    }
  };

  // METODO PARA OBTENER LOS PERMISOS
  static getPermissions: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { modulo } = req.query;
      const permissions = await RoleService.getPermissions(modulo as string);
      res.json(permissions);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener los permisos'
      });
    }
  };

  // METODO PARA ASIGNAR UN PERMISO A UN ROL
  static assignPermissionToRole: RequestHandler = async (
    req: Request<{}, {}, AssignPermissionRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { rolId, permisoId } = req.body;

      if (!rolId || !permisoId) {
        res.status(400).json({
          message: 'rolId y permisoId son requeridos'
        });
        return;
      }

      const result = await RoleService.assignPermissionToRole(rolId, permisoId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error al asignar permisos:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al asignar permisos'
      });
    }
  };

  // METODO PARA REMOVER UN PERMISO DE UN ROL
  static removePermissionFromRole: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { rolId, permisoId } = req.params;
      await RoleService.removePermissionFromRole(Number(rolId), Number(permisoId));
      res.json({ message: 'Permiso removido del rol correctamente' });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al remover permiso del rol'
      });
    }
  };

  // METODO PARA OBTENER LOS PERMISOS DE UN ROL
  static getRolePermissions: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { rolId } = req.params;
      const permissions = await RoleService.getRolePermissions(Number(rolId));
      res.json(permissions);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener permisos del rol'
      });
    }
  };

  // METODO PARA OBTENER LOS ROLES DE UN USUARIO
  static getUserRoles: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const roles = await RoleService.getUserRoles(Number(userId));
      res.json(roles);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener roles del usuario'
      });
    }
  };

  // METODO PARA OBTENER LOS PERMISOS DE UN USUARIO
  static getUserPermissions: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const permissions = await RoleService.getUserPermissions(Number(userId));
      res.json(permissions);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener permisos del usuario'
      });
    }
  };
}