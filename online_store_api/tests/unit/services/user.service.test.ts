import { UserService } from '../../../src/services/user.service';
import { UserModel } from '../../../src/models/user.model';

jest.mock('../../../src/models/user.model');

describe('UserService', () => {
    const service = new UserService();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loginUser', () => {
        it('should return user if credentials match', async () => {
            const mockUser = { email: 'test@example.com', password: '123456' };
            (UserModel.findOne as any).mockResolvedValue(mockUser);

            const result = await service.loginUser('test@example.com', '123456');
            expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(mockUser);
        });

        it('should throw error if user not found', async () => {
            (UserModel.findOne as any).mockResolvedValue(null);

            await expect(service.loginUser('notfound@example.com', '123456')).rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password mismatch', async () => {
            const mockUser = { email: 'test@example.com', password: 'wrong' };
            (UserModel.findOne as any).mockResolvedValue(mockUser);

            await expect(service.loginUser('test@example.com', '123456')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('registerUser', () => {
        it('should create and return new user', async () => {
            const saveMock = jest.fn().mockResolvedValue({ id: 'user123', email: 'new@example.com' });
            (UserModel as any).mockImplementation(() => ({
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
            (UserModel.findById as any).mockResolvedValue(mockUser);

            const result = await service.getUserProfile('user123');
            expect(UserModel.findById).toHaveBeenCalledWith('user123');
            expect(result).toEqual(mockUser);
        });

        it('should throw error if user not found', async () => {
            (UserModel.findById as any).mockResolvedValue(null);

            await expect(service.getUserProfile('missing')).rejects.toThrow('User not found');
        });
    });
});
