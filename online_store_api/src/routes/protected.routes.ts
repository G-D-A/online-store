import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/secret', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized' });
});

export default router;
