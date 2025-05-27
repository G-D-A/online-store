import { ProductService } from '../../../src/services/product.service';
import { ProductModel } from '../../../src/models/product.model';

jest.mock('../../../src/models/product.model');

describe('ProductService', () => {
    const service = new ProductService();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('listProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [{ id: '1', name: 'Test' }];
            (ProductModel.find as any).mockResolvedValue(mockProducts);

            const result = await service.listProducts();

            expect(ProductModel.find).toHaveBeenCalled();
            expect(result).toEqual(mockProducts);
        });
    });

    describe('getProductById', () => {
        it('should return product if found', async () => {
            const mockProduct = { id: '1', name: 'Test Product' };
            (ProductModel.findById as any).mockResolvedValue(mockProduct);

            const result = await service.getProductById('1');

            expect(ProductModel.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockProduct);
        });

        it('should throw error if product not found', async () => {
            (ProductModel.findById as any).mockResolvedValue(null);

            await expect(service.getProductById('999')).rejects.toThrow('Product not found');
            expect(ProductModel.findById).toHaveBeenCalledWith('999');
        });
    });
});
