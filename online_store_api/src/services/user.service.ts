import { UserModel } from '../models/user.model';

export class UserService {

    async loginUser(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }
        return user;
    }
    async registerUser(email: string, password: string) {
        const user = new UserModel({ email, password });
        return await user.save();
    }

    async getUserProfile(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    }
}
