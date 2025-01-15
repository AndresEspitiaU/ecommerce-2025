import { Router } from 'express';
import * as TallaController from '@/controllers/talla.controller';

const router = Router();

// Obtener todas las tallas
router.get('/', TallaController.getAll); 

// Obtener una talla por ID
router.get('/:id', TallaController.getById); 

// Crear una nueva talla
router.post('/', TallaController.create);

// Actualizar una talla existente
router.put('/:id', TallaController.update); 

// Desactivar una talla
router.delete('/:id', TallaController.remove); 

// Eliminar una talla permanentemente
router.delete('/:id/permanent', TallaController.removePermanent); 

export default router;
