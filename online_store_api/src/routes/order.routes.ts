import { Router } from 'express';
import { container } from 'tsyringe';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const controller = container.resolve(OrderController);

router.post('/', controller.create);
router.get('/user/:userId', controller.listByUser);

export default router;
