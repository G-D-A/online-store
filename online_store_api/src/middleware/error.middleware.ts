import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';
import mongoose from 'mongoose';
import { logger } from '../infra/logger';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction): void {
    let status = 500;
    let message = 'Internal Server Error';

    switch (true) {
        case err instanceof ValidationError:
            status = 400;
            message = err.message;
            break;
        case err.message?.toLowerCase().includes('not found'):
            status = 404;
            message = err.message;
            break;
        case err instanceof mongoose.Error.ValidationError:
            status = 422;
            message = err.message;
            break;
        case err.code === 11000:
            status = 422;
            const field = Object.keys(err.keyValue || {})[0];
            message = `Duplicate value for field: ${field}`;
            break;
        case typeof err.statusCode === 'number':
            status = err.statusCode;
            message = err.message || 'Error';
            break;
        default:
            message = err.message || message;
            break;
    }

    logger.error('api', message, err.stack);
    res.status(status).json({ error: message });
}
