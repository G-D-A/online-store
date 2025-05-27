"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../../src/app"));
const user_model_1 = require("../../src/models/user.model");
const product_model_1 = require("../../src/models/product.model");
let mongoServer;
let token;
let productId;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose_1.default.disconnect();
    await mongoose_1.default.connect(uri);
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
beforeEach(async () => {
    await user_model_1.UserModel.deleteMany({});
    await product_model_1.ProductModel.deleteMany({});
    // Register and login user
    const userRes = await (0, supertest_1.default)(app_1.default).post('/api/users/register').send({
        email: 'cart@test.com',
        password: '123456',
    });
    const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/users/login').send({
        email: 'cart@test.com',
        password: '123456',
    });
    token = loginRes.body.token;
    // Create a product
    const productRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Product', price: 50 });
    productId = productRes.body._id;
});
describe('Cart Routes', () => {
    it('should add item to cart', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 2 });
        expect(res.status).toBe(201);
        expect(res.body.items[0].productId).toBeDefined();
        expect(res.body.items[0].quantity).toBe(2);
    });
    it('should return current user cart', async () => {
        await (0, supertest_1.default)(app_1.default)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 1 });
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBeGreaterThan(0);
    });
    it('should remove product from cart', async () => {
        await (0, supertest_1.default)(app_1.default)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 1 });
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/cart/${productId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(0);
    });
    it('should checkout cart and create order', async () => {
        await (0, supertest_1.default)(app_1.default)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 2 });
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/cart/checkout')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res.body.total).toBe(100);
        expect(res.body.productIds).toContain(productId);
    });
    it('should return 401 without token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/cart');
        expect(res.status).toBe(401);
    });
});
