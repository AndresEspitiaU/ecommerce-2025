import { Router } from 'express';
import * as CuponController from '@/controllers/cupon.controller';

const router = Router();

router.get('/', CuponController.getAll); // Obtener todos los cupones
router.get('/:id', CuponController.getById); // Obtener un cupón por ID
router.post('/', CuponController.create); // Crear un nuevo cupón
router.put('/:id', CuponController.update); // Actualizar un cupón existente
// router.delete('/:id', CuponController.remove); // Eliminar (desactivar) un cupón
router.delete('/:id/permanent', CuponController.removePermanent); // Eliminar un cupón permanentemente

export default router;
