"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = require("../../../src/services/order.service");
const product_model_1 = require("../../../src/models/product.model");
const order_model_1 = require("../../../src/models/order.model");
jest.mock('../../../src/models/product.model');
jest.mock('../../../src/models/order.model');
describe('OrderService', () => {
    const service = new order_service_1.OrderService();
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create an order and calculate total', async () => {
        const mockProducts = [
            { _id: '1', price: 100 },
            { _id: '2', price: 200 },
        ];
        const saveMock = jest.fn().mockResolvedValue({ id: 'order123' });
        product_model_1.ProductModel.find.mockResolvedValue(mockProducts);
        order_model_1.OrderModel.mockImplementation(() => ({
            save: saveMock,
        }));
        const result = await service.createOrder('user123', ['1', '2']);
        expect(product_model_1.ProductModel.find).toHaveBeenCalledWith({ _id: { $in: ['1', '2'] } });
        expect(saveMock).toHaveBeenCalled();
        expect(result).toEqual({ id: 'order123' });
    });
    it('should get orders by user ID', async () => {
        const mockOrders = [{ id: 'order1' }, { id: 'order2' }];
        const populateMock = jest.fn().mockResolvedValue(mockOrders);
        order_model_1.OrderModel.find.mockReturnValue({
            populate: populateMock,
        });
        const result = await service.getOrdersByUser('user123');
        expect(order_model_1.OrderModel.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(result).toEqual(mockOrders);
    });
});
