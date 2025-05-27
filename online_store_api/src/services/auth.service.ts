import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret';

export class AuthService {
    generateToken(userId: string): string {
        return jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
    }

    verifyToken(token: string): { userId: string } {
        return jwt.verify(token, SECRET) as { userId: string };
    }
}
