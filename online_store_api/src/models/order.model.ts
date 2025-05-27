import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    total: { type: Number, required: true },
}, { timestamps: true });

export const OrderModel = mongoose.model('Order', orderSchema);
