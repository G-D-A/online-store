import { Router } from 'express';
import { container } from 'tsyringe';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const controller = container.resolve(ProductController);

router.get('/', controller.list);
router.get('/:id', controller.details);
router.post('/', controller.create);
router.post('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
