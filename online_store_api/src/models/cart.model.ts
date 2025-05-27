import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: { type: Number, default: 1 },
            },
        ],
    },
    { timestamps: true }
);

export const CartModel = mongoose.model('Cart', cartSchema);
