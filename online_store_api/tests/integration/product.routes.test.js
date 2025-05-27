"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../../src/app"));
const product_model_1 = require("../../src/models/product.model");
let mongoServer;
let token;
let productId;
beforeAll(async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
    }
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
    // Register and login user
    const userData = { email: 'product@test.com', password: '123456' };
    await (0, supertest_1.default)(app_1.default).post('/api/users/register').send(userData);
    const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/users/login').send(userData);
    token = loginRes.body.token;
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
afterEach(async () => {
    await product_model_1.ProductModel.deleteMany({});
});
describe('Product Routes', () => {
    it('should create a product', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
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
        await product_model_1.ProductModel.create({ name: 'P1', price: 10, description: 'D1' });
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
    it('should get product details', async () => {
        const product = await product_model_1.ProductModel.create({ name: 'Detail Product', price: 50, description: 'Detailed' });
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Detail Product');
    });
    it('should update a product', async () => {
        const product = await product_model_1.ProductModel.create({ name: 'Old', price: 20, description: 'Old desc' });
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated', price: 25, description: 'Updated desc' });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated');
    });
    it('should delete a product', async () => {
        const product = await product_model_1.ProductModel.create({ name: 'To Delete', price: 15, description: 'X' });
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Product deleted successfully');
    });
    it('should return 404 if product not found', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/products/645bdbf79753f2dc0c6c7fff')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Product not found');
    });
});
