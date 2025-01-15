// src/routes/user.routes.ts
import { Router } from 'express';
import { authMiddleware, hasPermission } from '@/middleware/auth.middleware';
import { UserController } from '@/controllers/user.controller';

const router = Router();

// Rutas públicas

// Ruta para verificar email 
router.get('/verify-email/:token', UserController.verifyEmail);

// Ruta para solicitar cambio de contraseña
router.post('/reset-password', UserController.resetPassword);

// Rutas protegidas (requieren autenticación y permisos específicos)

// Ruta de permiso para leer usuarios
router.get(
  '/users',
  authMiddleware,
  hasPermission(['READ_USERS']),
  UserController.getUsers
);

// Ruta de permiso para leer usuario por ID
router.get(
  '/users/:id',
  authMiddleware,
  hasPermission(['READ_USERS']),
  UserController.getUserById
);

// Ruta de permiso para actualizar usuario
router.put(
  '/users/:id',
  authMiddleware,
  hasPermission(['UPDATE_USERS']),
  UserController.updateUser
);

// Ruta de permiso para eliminar usuario
router.delete(
  '/users/:id',
  authMiddleware,
  hasPermission(['DELETE_USERS']),
  UserController.deleteUser
);

// Ruta de permiso para desactivar usuario
router.post(
  '/users/:id/deactivate',
  authMiddleware,
  hasPermission(['UPDATE_USERS']),
  UserController.deactivateUser
);

// Ruta de permiso para asignar roles a usuario
router.post(
  '/users/assign-roles',
  authMiddleware,
  hasPermission(['MANAGE_ROLES']),
  UserController.assignRolesToUser
);

// Ruta de permiso para remover roles de usuario
router.post(
  '/users/remove-roles',
  authMiddleware,
  hasPermission(['MANAGE_ROLES']),
  UserController.removeRolesFromUser
);

// Ruta de permiso para cambiar contraseña
router.post(
  '/users/change-password',
  authMiddleware,
  UserController.changePassword
);

export default router;
