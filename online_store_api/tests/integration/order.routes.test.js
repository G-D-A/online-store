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
const user_model_1 = require("../../src/models/user.model");
const order_model_1 = require("../../src/models/order.model");
let mongoServer;
let token;
let userId;
let productId1;
let productId2;
beforeAll(async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
    }
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
    // Register and login user
    const userData = { email: 'order@test.com', password: '123456' };
    await (0, supertest_1.default)(app_1.default).post('/api/users/register').send(userData);
    const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/users/login').send(userData);
    token = loginRes.body.token;
    // Get userId from DB
    const user = await user_model_1.UserModel.findOne({ email: userData.email });
    userId = user?._id.toString() || '';
    // Create products
    const product1 = await product_model_1.ProductModel.create({ name: 'Product 1', price: 50, description: 'Desc 1' });
    const product2 = await product_model_1.ProductModel.create({ name: 'Product 2', price: 30, description: 'Desc 2' });
    productId1 = product1._id.toString();
    productId2 = product2._id.toString();
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
afterEach(async () => {
    await order_model_1.OrderModel.deleteMany({});
});
describe('Order Routes', () => {
    it('should create an order', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
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
        await (0, supertest_1.default)(app_1.default)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ userId, productIds: [productId1] });
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/orders/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
    it('should fail to access orders without token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/orders/user/${userId}`);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
});
