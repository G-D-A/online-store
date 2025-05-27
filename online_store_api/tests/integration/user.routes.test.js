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
let mongoServer;
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
afterEach(async () => {
    await user_model_1.UserModel.deleteMany({});
});
describe('User Routes', () => {
    const userData = {
        email: 'test@example.com',
        password: '123456',
    };
    it('should register a new user', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/users/register').send(userData);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe(userData.email);
    });
    it('should login and return JWT token', async () => {
        await (0, supertest_1.default)(app_1.default).post('/api/users/register').send(userData);
        const res = await (0, supertest_1.default)(app_1.default).post('/api/users/login').send(userData);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
    it('should get user profile with valid token', async () => {
        await (0, supertest_1.default)(app_1.default).post('/api/users/register').send(userData);
        const loginRes = await (0, supertest_1.default)(app_1.default).post('/api/users/login').send(userData);
        const token = loginRes.body.token;
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe(userData.email);
    });
    it('should fail to get profile without token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/users/profile');
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Unauthorized');
    });
});
