import jwt from 'jsonwebtoken';
import { AuthService } from '../../../src/services/auth.service';

describe('AuthService', () => {
    const service = new AuthService();
    const userId = 'test-user-id';

    it('should generate a valid JWT token', () => {
        const token = service.generateToken(userId);
        expect(typeof token).toBe('string');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as { userId: string };
        expect(decoded.userId).toBe(userId);
    });

    it('should verify and return userId from token', () => {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1h' });
        const payload = service.verifyToken(token);

        expect(payload).toMatchObject({ userId });
    });

    it('should throw error for invalid token', () => {
        expect(() => {
            service.verifyToken('invalid.token.here');
        }).toThrowError();
    });
});
