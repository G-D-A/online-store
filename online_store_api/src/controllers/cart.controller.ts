import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CartService } from '../services/cart.service';
import { addToCartSchema } from '../validations/cart.validation';

@injectable()
export class CartController {
    constructor(@inject(CartService) private cartService: CartService) {}

    getCart = async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        const cart = await this.cartService.getCart(userId);
        res.json(cart || { items: [] });
    };

    addToCart = async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        const { productId, quantity } = await addToCartSchema.validate(req.body);
        const cart = await this.cartService.addToCart(userId, productId, quantity);
        res.status(201).json(cart);
    };

    removeFromCart = async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        const { productId } = req.params;
        const cart = await this.cartService.removeFromCart(userId, productId);
        res.json(cart);
    };

    checkout = async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        try {
            const order = await this.cartService.checkout(userId);
            res.status(201).json(order);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    };
}
