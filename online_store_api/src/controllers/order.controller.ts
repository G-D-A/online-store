import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { OrderService } from '../services/order.service';
import { orderSchema } from '../validations/order.validation';

@injectable()
export class OrderController {
    constructor(@inject(OrderService) private orderService: OrderService) {}

    create = async (req: Request, res: Response) => {
        const { userId, productIds } = await orderSchema.validate(req.body);
        const order = await this.orderService.createOrder(userId, productIds);
        res.status(201).json(order);
    };

    listByUser = async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const orders = await this.orderService.getOrdersByUser(userId);
        res.json(orders);
    };
}
