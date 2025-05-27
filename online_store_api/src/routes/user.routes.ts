import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = container.resolve(UserController);

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', authMiddleware, controller.profile);

export default router;
