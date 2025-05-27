import * as yup from 'yup';

export const productSchema = yup.object({
    name: yup.string().required(),
    price: yup.number().positive().required(),
    description: yup.string().optional(),
});
