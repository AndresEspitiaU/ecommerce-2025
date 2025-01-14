import { Router } from 'express';
import { PermissionsController } from '@/controllers/permissions.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// Ruta para obtener todos los permisos
router.get('/', authMiddleware, PermissionsController.getAllPermissions);

export default router;
