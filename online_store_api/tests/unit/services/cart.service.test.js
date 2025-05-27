"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cart_service_1 = require("../../../src/services/cart.service");
const cart_model_1 = require("../../../src/models/cart.model");
const order_model_1 = require("../../../src/models/order.model");
jest.mock('../../../src/models/cart.model');
jest.mock('../../../src/models/order.model');
describe('CartService', () => {
    const service = new cart_service_1.CartService();
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create a new cart if none exists when getting cart', async () => {
        const saveMock = jest.fn().mockResolvedValue(true);
        const mockCart = { userId: 'user123', items: [], save: saveMock };
        cart_model_1.CartModel.findOne.mockReturnValueOnce({
            populate: () => Promise.resolve(null),
        });
        cart_model_1.CartModel.mockImplementationOnce(() => mockCart);
        const result = await service.getCart('user123');
        expect(cart_model_1.CartModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(saveMock).toHaveBeenCalled();
        expect(result).toMatchObject({ userId: 'user123', items: [] });
    });
    it('should add a product to a new cart', async () => {
        const saveMock = jest.fn().mockResolvedValue(true);
        const mockCart = { userId: 'user123', items: [], save: saveMock };
        cart_model_1.CartModel.findOne.mockResolvedValueOnce(null);
        cart_model_1.CartModel.mockImplementationOnce(() => mockCart);
        await service.addToCart('user123', 'prod1', 1);
        expect(cart_model_1.CartModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        expect(saveMock).toHaveBeenCalled();
    });
    it('should remove a product from cart', async () => {
        const saveMock = jest.fn().mockResolvedValue(true);
        const mockCart = {
            items: [
                { productId: { toString: () => 'prod1' } },
                { productId: { toString: () => 'prod2' } },
            ],
            set: jest.fn(),
            save: saveMock,
        };
        cart_model_1.CartModel.findOne.mockResolvedValueOnce(mockCart);
        await service.removeFromCart('user123', 'prod1');
        expect(mockCart.set).toHaveBeenCalled();
        const args = mockCart.set.mock.calls[0];
        expect(args[0]).toBe('items');
        expect(args[1].length).toBe(1);
        expect(args[1][0].productId.toString()).toBe('prod2');
        expect(saveMock).toHaveBeenCalled();
    });
    it('should throw error when checkout cart is empty', async () => {
        cart_model_1.CartModel.findOne.mockReturnValueOnce({
            populate: () => Promise.resolve(null),
        });
        await expect(service.checkout('user123')).rejects.toThrow('Cart is empty');
    });
    it('should create order and clear cart on checkout', async () => {
        const saveCart = jest.fn().mockResolvedValue(true);
        const saveOrder = jest.fn().mockResolvedValue(true);
        const mockCart = {
            items: [
                { quantity: 2, productId: { _id: 'p1', price: 10 } },
                { quantity: 1, productId: { _id: 'p2', price: 20 } },
            ],
            save: saveCart,
        };
        cart_model_1.CartModel.findOne.mockReturnValue({
            populate: () => Promise.resolve(mockCart),
        });
        order_model_1.OrderModel.mockImplementation(() => ({
            save: saveOrder,
        }));
        const result = await service.checkout('user123');
        expect(saveOrder).toHaveBeenCalled();
        expect(saveCart).toHaveBeenCalled();
        expect(result).toBeDefined();
    });
    it('should increment quantity if product already in cart', async () => {
        const saveMock = jest.fn().mockResolvedValue(true);
        const mockCart = {
            items: [
                {
                    productId: {
                        toString: () => 'prod1',
                    },
                    quantity: 1,
                },
            ],
            save: saveMock,
        };
        cart_model_1.CartModel.findOne.mockResolvedValueOnce(mockCart);
        await service.addToCart('user123', 'prod1', 2);
        expect(mockCart.items[0].quantity).toBe(3);
        expect(saveMock).toHaveBeenCalled();
    });
    it('should skip existing item check if productId is undefined', async () => {
        const saveMock = jest.fn().mockResolvedValue(true);
        const mockCart = {
            items: [
                { productId: undefined, quantity: 1 },
            ],
            save: saveMock,
        };
        cart_model_1.CartModel.findOne.mockResolvedValueOnce(mockCart);
        await service.addToCart('user123', 'prodX', 1);
        expect(mockCart.items.length).toBe(2);
        expect(saveMock).toHaveBeenCalled();
    });
});
