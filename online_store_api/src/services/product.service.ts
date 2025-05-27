import { ProductModel } from '../models/product.model';

export class ProductService {
    async listProducts() {
        return await ProductModel.find();
    }

    async getProductById(productId: string) {
        const product = await ProductModel.findById(productId);
        if (!product) throw new Error('Product not found');
        return product;
    }
}
