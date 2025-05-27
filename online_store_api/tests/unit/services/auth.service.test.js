"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../../../src/services/auth.service");
describe('AuthService', () => {
    const service = new auth_service_1.AuthService();
    const userId = 'test-user-id';
    it('should generate a valid JWT token', () => {
        const token = service.generateToken(userId);
        expect(typeof token).toBe('string');
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'dev_secret');
        expect(decoded.userId).toBe(userId);
    });
    it('should verify and return userId from token', () => {
        const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1h' });
        const payload = service.verifyToken(token);
        expect(payload).toMatchObject({ userId });
    });
    it('should throw error for invalid token', () => {
        expect(() => {
            service.verifyToken('invalid.token.here');
        }).toThrowError();
    });
});
