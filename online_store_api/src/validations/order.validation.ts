import * as yup from 'yup';

export const orderSchema = yup.object({
    userId: yup.string().required(),
    productIds: yup.array().of(yup.string().required()).min(1).required(),
});
