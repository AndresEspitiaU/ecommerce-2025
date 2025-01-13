import { Router } from 'express';
import * as MarcaController from '@/controllers/marca.controller';
import { eliminarMarca } from '@/controllers/marca.controller';

const router = Router();

router.get('/', MarcaController.getAll);
router.get('/:id', MarcaController.getById);
router.post('/', MarcaController.create);
router.put('/:id', MarcaController.update);
// router.delete('/:id', MarcaController.remove);
router.delete('/:id', MarcaController.eliminarMarca);


export default router;
