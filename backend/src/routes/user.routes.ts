// src/routes/user.routes.ts
import { Router } from 'express';
import { authMiddleware, hasPermission } from '@/middleware/auth.middleware';
import { UserController } from '@/controllers/user.controller';

const router = Router();

// Rutas públicas
router.get('/verify-email/:token', UserController.verifyEmail);
router.post('/reset-password', UserController.resetPassword);

// Rutas protegidas (requieren autenticación y permisos específicos)
router.get(
  '/users',
  authMiddleware,
  hasPermission(['READ_USERS']),
  UserController.getUsers
);

router.get(
  '/users/:id',
  authMiddleware,
  hasPermission(['READ_USERS']),
  UserController.getUserById
);

router.put(
  '/users/:id',
  authMiddleware,
  hasPermission(['UPDATE_USERS']),
  UserController.updateUser
);

router.delete(
  '/users/:id',
  authMiddleware,
  hasPermission(['DELETE_USERS']),
  UserController.deleteUser
);

router.post(
  '/users/:id/deactivate',
  authMiddleware,
  hasPermission(['UPDATE_USERS']),
  UserController.deactivateUser
);

router.post(
  '/users/assign-roles',
  authMiddleware,
  hasPermission(['MANAGE_ROLES']),
  UserController.assignRolesToUser
);

router.post(
  '/users/remove-roles',
  authMiddleware,
  hasPermission(['MANAGE_ROLES']),
  UserController.removeRolesFromUser
);

router.post(
  '/users/change-password',
  authMiddleware,
  UserController.changePassword
);

export default router;
