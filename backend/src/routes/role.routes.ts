// src/routes/role.routes.ts
import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { authMiddleware, hasPermission, hasRole } from '@/middleware/auth.middleware';
import { UserController } from '@/controllers/user.controller';
import { RoleService } from '@/services/role.service';

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

// Ruta para actualizar un rol
router.put('/roles/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const updatedRole = await RoleService.updateRole(Number(id), { nombre, descripcion });
    if (!updatedRole) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.json(updatedRole);
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
});

// Ruta para eliminar un rol
router.delete('/roles/:id', 
  authMiddleware, 
  hasPermission(['MANAGE_ROLES']), 
  RoleController.deleteRole
);


// Asignar permisos a roles
router.post('/roles/assign-permission', 
  authMiddleware,
  hasRole(['SUPER_ADMIN']),
  RoleController.assignPermissionToRole
);


export default router;