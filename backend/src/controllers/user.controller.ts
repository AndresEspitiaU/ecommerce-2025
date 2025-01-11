import { UserService } from '@/services/user.service';
import type { Request, Response } from 'express';


export class UserController {
  
  // METODO PARA ASIGNAR ROLES A UN USUARIO
  static async assignRolesToUser(req: Request, res: Response) {
    try {
      const { userId, roles } = req.body;

      if (!userId || !roles || !Array.isArray(roles)) {
        return res.status(400).json({ message: 'userId y roles son requeridos y roles debe ser un arreglo' });
      }

      await UserService.assignRolesToUser(userId, roles);
      res.status(200).json({ message: 'Roles asignados al usuario correctamente' });
    } catch (error) {
      console.error('Error asignando roles al usuario:', error);
      res.status(500).json({ message: 'Error asignando roles al usuario' });
    }
  }
}