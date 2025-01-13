import { Router } from 'express';
import * as ColorController from '@/controllers/color.controller';

const router = Router();

router.get('/', ColorController.getAll);
router.get('/:id', ColorController.getById);
router.post('/', ColorController.create);
router.put('/:id', ColorController.update);
router.delete('/:id', ColorController.remove);
router.delete('/:id/permanente', ColorController.eliminarColorPermanentemente);

export default router;
