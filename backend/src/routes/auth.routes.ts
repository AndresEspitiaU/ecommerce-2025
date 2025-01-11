// src/routes/auth.routes.ts
import { Router } from 'express';
import { authMiddleware, hasRole } from '@/middleware/auth.middleware';
import { AuthController } from '@/controllers/auth.controller';
import { RoleController } from '@/controllers/role.controller';

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

// ... resto de las rutas

export default router;