import { Router } from 'express';
import * as TallaController from '@/controllers/talla.controller';

const router = Router();

router.get('/', TallaController.getAll); // Obtener todas las tallas
router.get('/:id', TallaController.getById); // Obtener una talla por ID
router.post('/', TallaController.create); // Crear una nueva talla
router.put('/:id', TallaController.update); // Actualizar una talla existente
router.delete('/:id', TallaController.remove); // Desactivar una talla
router.delete('/:id/permanent', TallaController.removePermanent); // Eliminar una talla permanentemente

export default router;
