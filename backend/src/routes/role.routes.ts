// src/routes/role.routes.ts
import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { authMiddleware, hasPermission, hasRole } from '@/middleware/auth.middleware';
import { UserController } from '@/controllers/user.controller';

const router = Router();

// Roles
router.post('/roles', 
  authMiddleware, 
  hasPermission(['MANAGE_ROLES']), 
  RoleController.createRole
);

router.get('/roles', 
  authMiddleware, 
  RoleController.getRoles
);

router.post('/users/assign-roles', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.assignRolesToUser
);

// Asignar permisos a roles
router.post('/roles/assign-permission', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.assignPermissionToRole
);


export default router;