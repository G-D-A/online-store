import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';
import { UserModel } from '../../src/models/user.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await UserModel.deleteMany({});
});

describe('User Routes', () => {
    const userData = {
        email: 'test@example.com',
        password: '123456',
    };

    it('should register a new user', async () => {
        const res = await request(app).post('/api/users/register').send(userData);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe(userData.email);
    });

    it('should login and return JWT token', async () => {
        await request(app).post('/api/users/register').send(userData);
        const res = await request(app).post('/api/users/login').send(userData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should get user profile with valid token', async () => {
        await request(app).post('/api/users/register').send(userData);
        const loginRes = await request(app).post('/api/users/login').send(userData);
        const token = loginRes.body.token;

        const res = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe(userData.email);
    });

    it('should fail to get profile without token', async () => {
        const res = await request(app).get('/api/users/profile');
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
});
