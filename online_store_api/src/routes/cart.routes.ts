import { Router } from 'express';
import { container } from 'tsyringe';
import { CartController } from '../controllers/cart.controller';

const router = Router();
const controller = container.resolve(CartController);

router.get('/', controller.getCart);
router.post('/add', controller.addToCart);
router.post('/checkout', controller.checkout);
router.delete('/:productId', controller.removeFromCart);

export default router;
