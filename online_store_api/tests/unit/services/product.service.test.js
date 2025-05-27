"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = require("../../../src/services/product.service");
const product_model_1 = require("../../../src/models/product.model");
jest.mock('../../../src/models/product.model');
describe('ProductService', () => {
    const service = new product_service_1.ProductService();
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('listProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [{ id: '1', name: 'Test' }];
            product_model_1.ProductModel.find.mockResolvedValue(mockProducts);
            const result = await service.listProducts();
            expect(product_model_1.ProductModel.find).toHaveBeenCalled();
            expect(result).toEqual(mockProducts);
        });
    });
    describe('getProductById', () => {
        it('should return product if found', async () => {
            const mockProduct = { id: '1', name: 'Test Product' };
            product_model_1.ProductModel.findById.mockResolvedValue(mockProduct);
            const result = await service.getProductById('1');
            expect(product_model_1.ProductModel.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockProduct);
        });
        it('should throw error if product not found', async () => {
            product_model_1.ProductModel.findById.mockResolvedValue(null);
            await expect(service.getProductById('999')).rejects.toThrow('Product not found');
            expect(product_model_1.ProductModel.findById).toHaveBeenCalledWith('999');
        });
    });
});
