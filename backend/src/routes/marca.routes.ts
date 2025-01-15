import { Router } from 'express';
import * as MarcaController from '@/controllers/marca.controller';
import { eliminarMarca } from '@/controllers/marca.controller';

const router = Router();

// Ruta para obtener todas las marcas
router.get('/', MarcaController.getAll);

// Ruta para obtener una marca por su id
router.get('/:id', MarcaController.getById);

// Ruta para crear una marca
router.post('/', MarcaController.create);

// Ruta para actualizar una marca
router.put('/:id', MarcaController.update);

// Ruta para desactivar una marca
// router.delete('/:id', MarcaController.remove);

// Ruta para eliminar una marca
router.delete('/:id', MarcaController.eliminarMarca);


export default router;
