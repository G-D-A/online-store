import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';
import { ProductModel } from '../../src/models/product.model';
import { UserModel } from '../../src/models/user.model';
import { OrderModel } from '../../src/models/order.model';

let mongoServer: MongoMemoryServer;
let token: string;
let userId: string;
let productId1: string;
let productId2: string;

beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Register and login user
    const userData = { email: 'order@test.com', password: '123456' };
    await request(app).post('/api/users/register').send(userData);
    const loginRes = await request(app).post('/api/users/login').send(userData);
    token = loginRes.body.token;

    // Get userId from DB
    const user = await UserModel.findOne({ email: userData.email });
    userId = user?._id.toString() || '';

    // Create products
    const product1 = await ProductModel.create({ name: 'Product 1', price: 50, description: 'Desc 1' });
    const product2 = await ProductModel.create({ name: 'Product 2', price: 30, description: 'Desc 2' });

    productId1 = product1._id.toString();
    productId2 = product2._id.toString();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await OrderModel.deleteMany({});
});

describe('Order Routes', () => {
    it('should create an order', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId, productIds: [productId1, productId2] });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.productIds).toHaveLength(2);
        expect(res.body.total).toBe(80);
    });

    it('should fetch orders for a user', async () => {
        // Create order manually
        await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId, productIds: [productId1] });

        const res = await request(app)
            .get(`/api/orders/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should fail to access orders without token', async () => {
        const res = await request(app).get(`/api/orders/user/${userId}`);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
});
