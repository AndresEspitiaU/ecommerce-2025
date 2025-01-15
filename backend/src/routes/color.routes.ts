import { Router } from 'express';
import * as ColorController from '@/controllers/color.controller';

const router = Router();

// Ruta para obtener todos los colores
router.get('/', ColorController.getAll);

// Ruta para obtener un color por su id
router.get('/:id', ColorController.getById);

// Ruta para crear un color
router.post('/', ColorController.create);

// Ruta para actualizar un color
router.put('/:id', ColorController.update);

// Ruta para desactivar un color
router.delete('/:id', ColorController.remove);

// Ruta para eliminar un color permanentemente
router.delete('/:id/permanente', ColorController.eliminarColorPermanentemente);

export default router;
