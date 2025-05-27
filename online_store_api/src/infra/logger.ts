import winston from 'winston';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        return {
            ...info,
            message: info.message,
            stack: info.stack,
        };
    }
    return info;
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            return stack
                ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
                : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
        }),
    ],
});
