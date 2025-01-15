import { Router } from 'express';
import * as SubcategoryController from '@/controllers/subcategory.controller';

const router = Router();

// Ruta para obtener todas las subcategorías
router.get('/', SubcategoryController.getAll); 

// Obtener una subcategoría por ID
router.get('/:id', SubcategoryController.getById); 

// Crear una subcategoría
router.post('/', SubcategoryController.create); 

// Actualizar una subcategoría
router.put('/:id', SubcategoryController.update); 

// Eliminar una subcategoría
router.delete('/:id', SubcategoryController.remove); 

export default router;
