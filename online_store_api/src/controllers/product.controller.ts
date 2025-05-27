import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ProductModel } from '../models/product.model';
import { productSchema } from '../validations/product.validation';
import { ProductService } from '../services/product.service';

@injectable()
export class ProductController {
    constructor(@inject(ProductService) private productService: ProductService) {}

    list = async (req: Request, res: Response): Promise<void> => {
        const products = await this.productService.listProducts();
        res.json(products);
    };

    details = async (req: Request, res: Response): Promise<void> => {
        const product = await this.productService.getProductById(req.params.id);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const { name, price, description } = await productSchema.validate(req.body);
        const product = new ProductModel({ name, price, description });
        await product.save();
        res.status(201).json(product);
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const { name, price, description } = req.body;
        const updated = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { name, price, description },
            { new: true }
        );

        if (!updated) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json(updated);
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const deleted = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json({ message: 'Product deleted successfully' });
    };
}
