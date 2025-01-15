// src/routes/auth.routes.ts
import { Router } from 'express';
import { authMiddleware, hasRole } from '@/middleware/auth.middleware';
import { AuthController } from '@/controllers/auth.controller';
import { RoleController } from '@/controllers/role.controller';

const router = Router();

// Rutas públicas
// Ruta para registrar un nuevo usuario
router.post('/register', AuthController.register);

// Ruta para iniciar sesión
router.post('/login', AuthController.login);

// Rutas protegidas para roles y permisos
router.post('/roles', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.createRole
);

// Ruta para obtener todos los roles (accesible para SUPER_ADMIN y ADMIN)
router.get('/roles', 
  authMiddleware,
  hasRole(['SUPER_ADMIN', 'ADMIN']),
  RoleController.getRoles
);

// Ruta para obtener un rol específico (accesible para SUPER_ADMIN y ADMIN)
router.put('/roles/:id', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.updateRole
);

// Ruta para eliminar un rol específico (solo accesible para SUPER_ADMIN)
router.delete('/roles/:id', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.deleteRole
);

// Gestionar permisos
// Ruta para obtener todos los permisos (accesible para SUPER_ADMIN y ADMIN)
router.get('/permissions', 
  authMiddleware,
  hasRole(['SUPER_ADMIN', 'ADMIN']),
  RoleController.getPermissions
);

// Ruta para asignar permisos a un rol específico (solo accesible para SUPER_ADMIN)
router.post('/roles/:roleId/permissions', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.assignPermissionToRole
);

// Ruta para eliminar un permiso de un rol específico (solo accesible para SUPER_ADMIN)
router.delete('/roles/:roleId/permissions/:permisoId', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.removePermissionFromRole
);

// Ruta para obtener los permisos asignados a un rol específico (accesible para SUPER_ADMIN y ADMIN)
router.get('/roles/:roleId/permissions', 
  authMiddleware,
  hasRole(['SUPER_ADMIN', 'ADMIN']),
  RoleController.getRolePermissions
);

// Usuarios y Roles
// Ruta para asignar roles a un usuario específico (solo accesible para SUPER_ADMIN)
router.post('/users/:userId/roles', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.assignRolesToUser
);

// Ruta para obtener los roles asignados a un usuario específico (accesible para SUPER_ADMIN y ADMIN)
router.get('/users/:userId/roles', 
  authMiddleware,
  hasRole(['SUPER_ADMIN', 'ADMIN']),
  RoleController.getUserRoles
);

// Ruta para obtener los permisos asignados a un usuario específico (accesible para SUPER_ADMIN y ADMIN)
router.get('/users/:userId/permissions', 
  authMiddleware,
  hasRole(['SUPER_ADMIN', 'ADMIN']),
  RoleController.getUserPermissions
);

export default router;