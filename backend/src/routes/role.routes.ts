// src/routes/role.routes.ts
import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { authMiddleware, hasPermission, hasRole } from '@/middleware/auth.middleware';

const router = Router();

// Crear rol
router.post(
  '/roles',
  authMiddleware,
  hasPermission(['MANAGE_ROLES']),
  RoleController.createRole
);

// Obtener todos los roles
router.get('/roles', authMiddleware, RoleController.getRoles);

// Obtener permisos de un rol
router.get(
  '/roles/:rolId/permissions',
  authMiddleware,
  hasPermission(['VIEW_ROLE_PERMISSIONS']),
  RoleController.getRolePermissions
);

// Asignar permisos a roles
router.post(
  '/roles/assign-permission',
  authMiddleware,
  hasPermission(['MANAGE_PERMISSIONS']),
  RoleController.assignPermissionToRole
);

// Remover permisos de roles
router.post(
  '/roles/remove-permission',
  authMiddleware,
  hasPermission(['MANAGE_PERMISSIONS']),
  RoleController.removePermissionFromRole
);

// Asignar roles a usuarios
router.post(
  '/users/assign-roles',
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.assignRolesToUser
);

export default router;
