import { OrderModel } from '../models/order.model';
import { CartModel } from '../models/cart.model';

export class CartService {
    async getCart(userId: string) {
        let cart = await CartModel.findOne({ userId }).populate('items.productId');
        if (!cart) {
            cart = new CartModel({ userId, items: [] });
            await cart.save();
        }
        return cart;
    }

    async addToCart(userId: string, productId: string, quantity = 1) {
        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = new CartModel({ userId, items: [{ productId, quantity }] });
        } else {
            const existing = cart.items.find((item) => {
                if (!item.productId) return false;
                return item.productId.toString() === productId;
            });

            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        return await cart.save();
    }

    async removeFromCart(userId: string, productId: string) {
        const cart = await CartModel.findOne({ userId });
        if (!cart) return null;

        cart.set(
            'items',
            cart.items.filter((item) => {
                if (!item.productId) return true;
                return item.productId.toString() !== productId;
            })
        );

        return await cart.save();
    }

    async checkout(userId: string) {
        const cart = await CartModel.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        const productIds = cart.items.map((item) => item.productId?._id.toString());
        const total = cart.items.reduce((sum, item) => {
            const price = (item.productId as any)?.price || 0;
            return sum + price * item.quantity;
        }, 0);

        const order = new OrderModel({
            userId,
            productIds,
            total,
        });

        await order.save();

        cart.items.splice(0, cart.items.length);
        await cart.save();

        return order;
    }
}
