import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export function authMiddleware(req: Request, res: Response, next: NextFunction): any {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = authService.verifyToken(token);
        (req as any).user = { id: payload.userId };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
