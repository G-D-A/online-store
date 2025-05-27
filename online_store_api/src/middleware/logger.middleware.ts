import { Request, Response, NextFunction } from 'express';
import { logger } from '../infra/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    logger.info('api', `${req.method} ${req.originalUrl}`);
    next();
}
