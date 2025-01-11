// src/controllers/role.controller.ts
import type { Request, Response } from 'express';
import { RoleService } from '@/services/role.service';

interface RoleRequest {
  nombre: string;
  descripcion?: string;
}

interface AssignPermissionRequest {
  rolId: number;
  permisoId: number;
  asignadoPor: number;
}

export class RoleController {
  static assignRolesToUser(arg0: string, authMiddleware: (req: import("../types/auth.types").AuthRequest, res: Response, next: import("express").NextFunction) => Promise<Response<any, Record<string, any>> | undefined>, arg2: (req: import("../types/auth.types").AuthRequest, res: Response, next: import("express").NextFunction) => Promise<Response<any, Record<string, any>> | undefined>, assignRolesToUser: any) {
    throw new Error('Method not implemented.');
  }
  
  // METODO PARA CREAR UN ROL
  static async createRole(req: Request<any, any, RoleRequest>, res: Response) {
    try {
      const { nombre, descripcion } = req.body;
      
      if (!nombre) {
        return res.status(400).json({ 
          message: 'El nombre del rol es requerido' 
        });
      }

      const role = await RoleService.createRole({ nombre, descripcion });
      return res.status(201).json(role);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al crear el rol'
      });
    }
  }

  // METODO PARA OBTENER LOS ROLES
  static async getRoles(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const roles = await RoleService.getRoles(includeInactive);
      return res.json(roles);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener los roles'
      });
    }
  }

  // METODO PARA ACTUALIZAR UN ROL
  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      if (!nombre) {
        return res.status(400).json({ 
          message: 'El nombre del rol es requerido' 
        });
      }

      const role = await RoleService.updateRole(Number(id), { nombre, descripcion });
      return res.json(role);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al actualizar el rol'
      });
    }
  }

  // METODO PARA ELIMINAR UN ROL
  static async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RoleService.deleteRole(Number(id));
      return res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al eliminar el rol'
      });
    }
  }

  // METODO PARA ASIGNAR UN ROL A UN USUARIO
  static async createPermission(req: Request, res: Response) {
    try {
      const { nombre, codigo, descripcion, modulo } = req.body;

      if (!nombre || !codigo || !modulo) {
        return res.status(400).json({ 
          message: 'Nombre, código y módulo son requeridos' 
        });
      }

      const permission = await RoleService.createPermission({
        nombre,
        codigo,
        descripcion,
        modulo
      });
      return res.status(201).json(permission);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al crear el permiso'
      });
    }
  }

  // METODO PARA OBTENER LOS PERMISOS
  static async getPermissions(req: Request, res: Response) {
    try {
      const { modulo } = req.query;
      const permissions = await RoleService.getPermissions(modulo as string);
      return res.json(permissions);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener los permisos'
      });
    }
  }

  // METODO PARA ASIGNAR UN PERMISO A UN ROL
  static async assignPermissionToRole(req: Request, res: Response) {
    try {
      const { rolID, permisoID } = req.body;

      if (!rolID || !permisoID) {
        return res.status(400).json({ message: 'rolID y permisoID son requeridos' });
      }

      await RoleService.assignPermissionToRole(rolID, permisoID);
      res.status(200).json({ message: 'Permiso asignado al rol correctamente' });
    } catch (error) {
      console.error('Error asignando permiso al rol:', error);
      res.status(500).json({ message: 'Error asignando permiso al rol' });
    }
  }


  // METODO PARA REMOVER UN PERMISO DE UN ROL
  static async removePermissionFromRole(req: Request, res: Response) {
    try {
      const { rolId, permisoId } = req.params;

      await RoleService.removePermissionFromRole(
        Number(rolId),
        Number(permisoId)
      );
      return res.json({ message: 'Permiso removido del rol correctamente' });
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al remover permiso del rol'
      });
    }
  }

  // METODO PARA OBTENER LOS PERMISOS DE UN ROL
  static async getRolePermissions(req: Request, res: Response) {
    try {
      const { rolId } = req.params;
      const permissions = await RoleService.getRolePermissions(Number(rolId));
      return res.json(permissions);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener permisos del rol'
      });
    }
  }

  // METODO PARA OBTENER LOS ROLES DE UN USUARIO
  static async getUserRoles(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const roles = await RoleService.getUserRoles(Number(userId));
      return res.json(roles);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener roles del usuario'
      });
    }
  }

  // METODO PARA OBTENER LOS PERMISOS DE UN USUARIO
  static async getUserPermissions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const permissions = await RoleService.getUserPermissions(Number(userId));
      return res.json(permissions);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al obtener permisos del usuario'
      });
    }
  }
}