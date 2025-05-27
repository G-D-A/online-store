"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../../../src/services/user.service");
const user_model_1 = require("../../../src/models/user.model");
jest.mock('../../../src/models/user.model');
describe('UserService', () => {
    const service = new user_service_1.UserService();
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('loginUser', () => {
        it('should return user if credentials match', async () => {
            const mockUser = { email: 'test@example.com', password: '123456' };
            user_model_1.UserModel.findOne.mockResolvedValue(mockUser);
            const result = await service.loginUser('test@example.com', '123456');
            expect(user_model_1.UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(mockUser);
        });
        it('should throw error if user not found', async () => {
            user_model_1.UserModel.findOne.mockResolvedValue(null);
            await expect(service.loginUser('notfound@example.com', '123456')).rejects.toThrow('Invalid credentials');
        });
        it('should throw error if password mismatch', async () => {
            const mockUser = { email: 'test@example.com', password: 'wrong' };
            user_model_1.UserModel.findOne.mockResolvedValue(mockUser);
            await expect(service.loginUser('test@example.com', '123456')).rejects.toThrow('Invalid credentials');
        });
    });
    describe('registerUser', () => {
        it('should create and return new user', async () => {
            const saveMock = jest.fn().mockResolvedValue({ id: 'user123', email: 'new@example.com' });
            user_model_1.UserModel.mockImplementation(() => ({
                save: saveMock,
            }));
            const result = await service.registerUser('new@example.com', 'pass123');
            expect(result).toEqual({ id: 'user123', email: 'new@example.com' });
            expect(saveMock).toHaveBeenCalled();
        });
    });
    describe('getUserProfile', () => {
        it('should return user if found', async () => {
            const mockUser = { id: 'user123', email: 'test@example.com' };
            user_model_1.UserModel.findById.mockResolvedValue(mockUser);
            const result = await service.getUserProfile('user123');
            expect(user_model_1.UserModel.findById).toHaveBeenCalledWith('user123');
            expect(result).toEqual(mockUser);
        });
        it('should throw error if user not found', async () => {
            user_model_1.UserModel.findById.mockResolvedValue(null);
            await expect(service.getUserProfile('missing')).rejects.toThrow('User not found');
        });
    });
});
