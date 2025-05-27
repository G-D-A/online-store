import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';
import { ProductModel } from '../../src/models/product.model';

let mongoServer: MongoMemoryServer;
let token: string;
let productId: string;

beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Register and login user
    const userData = { email: 'product@test.com', password: '123456' };
    await request(app).post('/api/users/register').send(userData);
    const loginRes = await request(app).post('/api/users/login').send(userData);
    token = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await ProductModel.deleteMany({});
});

describe('Product Routes', () => {
    it('should create a product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Product',
                price: 100,
                description: 'Test description',
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Product');

        productId = res.body._id;
    });

    it('should list all products', async () => {
        await ProductModel.create({ name: 'P1', price: 10, description: 'D1' });

        const res = await request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get product details', async () => {
        const product = await ProductModel.create({ name: 'Detail Product', price: 50, description: 'Detailed' });

        const res = await request(app)
            .get(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Detail Product');
    });

    it('should update a product', async () => {
        const product = await ProductModel.create({ name: 'Old', price: 20, description: 'Old desc' });

        const res = await request(app)
            .post(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated', price: 25, description: 'Updated desc' });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated');
    });

    it('should delete a product', async () => {
        const product = await ProductModel.create({ name: 'To Delete', price: 15, description: 'X' });

        const res = await request(app)
            .delete(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product deleted successfully');
    });

    it('should return 404 if product not found', async () => {
        const res = await request(app)
            .get('/api/products/645bdbf79753f2dc0c6c7fff')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Product not found');
    });
});
