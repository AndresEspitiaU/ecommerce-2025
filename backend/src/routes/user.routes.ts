import { Router } from 'express';

import { authMiddleware, hasPermission } from '@/middleware/auth.middleware';
import { UserController } from '@/controllers/user.controller';

const router = Router();

// Asignación de roles a usuarios
router.post('/assign-roles', 
  authMiddleware, 
  hasPermission(['MANAGE_USERS']), 
  UserController.assignRolesToUser
);

export default router;