// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { RoleController } from '@/controllers/role.controller';
import { authMiddleware, hasRole } from '@/middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rutas protegidas de roles
router.post('/roles', 
  authMiddleware, 
  hasRole(['SUPER_ADMIN']), 
  RoleController.createRole
);

router.get('/roles', 
  authMiddleware, 
  hasRole(['SUPER_ADMIN', 'ADMIN']), 
  RoleController.getRoles
);

export default router;