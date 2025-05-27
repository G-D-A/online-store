import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
}, { timestamps: true });

export const ProductModel = mongoose.model('Product', productSchema);
