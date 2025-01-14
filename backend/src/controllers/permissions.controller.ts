import type { Request, Response, NextFunction } from 'express';
import { PermissionService } from '@/services/permission.service';

export class PermissionsController {

  // OBTENER TODOS LOS PERMISOS
  static async getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await PermissionService.getAllPermissions();
      res.json(permissions);
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      res.status(500).json({ message: 'Error al obtener permisos' });
    }
  }
}
