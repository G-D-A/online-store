import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';
import { UserModel } from '../../src/models/user.model';
import { ProductModel } from '../../src/models/product.model';

let mongoServer: MongoMemoryServer;
let token: string;
let productId: string;

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

beforeEach(async () => {
    await UserModel.deleteMany({});
    await ProductModel.deleteMany({});

    // Register and login user
    const userRes = await request(app).post('/api/users/register').send({
        email: 'cart@test.com',
        password: '123456',
    });

    const loginRes = await request(app).post('/api/users/login').send({
        email: 'cart@test.com',
        password: '123456',
    });

    token = loginRes.body.token;

    // Create a product
    const productRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Product', price: 50 });

    productId = productRes.body._id;
});

describe('Cart Routes', () => {
    it('should add item to cart', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 2 });

        expect(res.status).toBe(201);
        expect(res.body.items[0].productId).toBeDefined();
        expect(res.body.items[0].quantity).toBe(2);
    });

    it('should return current user cart', async () => {
        await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 1 });

        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.items.length).toBeGreaterThan(0);
    });

    it('should remove product from cart', async () => {
        await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 1 });

        const res = await request(app)
            .delete(`/api/cart/${productId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(0);
    });

    it('should checkout cart and create order', async () => {
        await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 2 });

        const res = await request(app)
            .post('/api/cart/checkout')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(201);
        expect(res.body.total).toBe(100);
        expect(res.body.productIds).toContain(productId);
    });

    it('should return 401 without token', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.status).toBe(401);
    });
});
