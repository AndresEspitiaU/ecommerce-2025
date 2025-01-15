// src/routes/role.routes.ts
import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { authMiddleware, hasPermission, hasRole } from '@/middleware/auth.middleware';

const router = Router();

// Roles
router.post(
  '/roles',
  authMiddleware,
  hasPermission(['MANAGE_ROLES']),
  RoleController.createRole
);

router.get('/roles', authMiddleware, RoleController.getRoles);

router.post(
  '/users/assign-roles',
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.assignRolesToUser
);

// **Asignación de permisos a roles**
router.post(
  '/roles/assign-permission',
  authMiddleware,
  hasPermission(['MANAGE_PERMISSIONS']),
  RoleController.assignPermissionToRole
);

router.post(
  '/roles/remove-permission',
  authMiddleware,
  hasPermission(['MANAGE_PERMISSIONS']),
  RoleController.removePermissionFromRole
);

router.get(
  '/roles/:rolId/permissions',
  authMiddleware,
  hasPermission(['VIEW_ROLES']),
  RoleController.getRolePermissions
);

export default router;
