import * as yup from 'yup';

export const addToCartSchema = yup.object({
    productId: yup.string().required(),
    quantity: yup.number().min(1).default(1),
});
