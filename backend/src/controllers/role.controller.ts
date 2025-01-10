// src/controllers/role.controller.ts
import type { Request, Response } from 'express';
import { RoleService } from '@/services/role.service';

export class RoleController {
  static async createRole(req: Request, res: Response) {
    try {
      const { nombre, descripcion } = req.body;
      if (!nombre) {
        return res.status(400).json({ message: 'El nombre del rol es requerido' });
      }

      const role = await RoleService.createRole({ nombre, descripcion });
      return res.status(201).json(role);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error al crear el rol'
      });
    }
  }

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

  // ... Aquí irían los demás métodos del controlador
}