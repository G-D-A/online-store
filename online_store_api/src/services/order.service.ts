import { OrderModel } from '../models/order.model';
import { ProductModel } from '../models/product.model';

export class OrderService {
    async createOrder(userId: string, productIds: string[]) {
        const products = await ProductModel.find({ _id: { $in: productIds } });

        const total = products.reduce((sum, p) => sum + p.price, 0);

        const order = new OrderModel({
            userId,
            productIds,
            total,
        });

        return await order.save();
    }

    async getOrdersByUser(userId: string) {
        return await OrderModel.find({ userId }).populate('productIds');
    }
}
