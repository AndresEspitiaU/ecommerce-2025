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

// Asignación de roles a usuarios
router.post('/assign-roles', 
  authMiddleware, 
  hasPermission(['MANAGE_USERS']), 
  UserController.assignRolesToUser
);

router.put('/roles/:rolId', 
  authMiddleware, 
  hasPermission(['MANAGE_ROLES']), 
  RoleController.updateRole
);

router.delete('/roles/:rolId', 
  authMiddleware, 
  hasPermission(['MANAGE_ROLES']), 
  RoleController.deleteRole
);

// Permisos
router.post('/permissions', 
  authMiddleware, 
  hasRole(['SUPER_ADMIN']), 
  RoleController.createPermission
);

router.get('/permissions', 
  authMiddleware, 
  RoleController.getPermissions
);

// Asignación de permisos a roles
router.post('/roles/permissions', 
  authMiddleware, 
  hasPermission(['MANAGE_ROLES']), 
  RoleController.assignPermissionToRole
);

router.delete('/roles/:rolId/permissions/:permisoId', 
  authMiddleware, 
  hasPermission(['MANAGE_ROLES']), 
  RoleController.removePermissionFromRole
);


// Consultas
router.get('/roles/:rolId/permissions', 
  authMiddleware, 
  RoleController.getRolePermissions
);

router.get('/users/:userId/roles', 
  authMiddleware, 
  RoleController.getUserRoles
);

router.get('/users/:userId/permissions', 
  authMiddleware, 
  RoleController.getUserPermissions
);

export default router;