import mongoose from 'mongoose';
import { logger } from './logger';

export class DatabaseConnector {
    private static instance: DatabaseConnector;
    private isConnected = false;

    private constructor() {}

    public static getInstance(): DatabaseConnector {
        if (!DatabaseConnector.instance) {
            DatabaseConnector.instance = new DatabaseConnector();
        }
        return DatabaseConnector.instance;
    }

    public async connect(uri: any): Promise<void> {
        if (this.isConnected) {
            logger.info('Already connected to MongoDB');
            return;
        }

        try {
            await mongoose.connect(uri);
            this.isConnected = true;
            logger.info('✅ MongoDB connection established');
        } catch (error) {
            logger.error('db', '❌ MongoDB connection failed:', error);
            throw error;
        }
    }
}
