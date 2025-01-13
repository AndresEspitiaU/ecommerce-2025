import { Router } from 'express';
import * as SubcategoryController from '@/controllers/subcategory.controller';

const router = Router();

// Definir rutas
router.get('/', SubcategoryController.getAll); // Obtener todas las subcategorías
router.get('/:id', SubcategoryController.getById); // Obtener una subcategoría por ID
router.post('/', SubcategoryController.create); // Crear una subcategoría
router.put('/:id', SubcategoryController.update); // Actualizar una subcategoría
router.delete('/:id', SubcategoryController.remove); // Eliminar una subcategoría

export default router;
