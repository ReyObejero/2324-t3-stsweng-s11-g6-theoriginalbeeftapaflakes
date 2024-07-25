import { z } from 'zod';
import { errorMessages } from '@/constants';

export const getProductByIdSchema = z.object({
    params: z.object({
        productId: z
            .string()
            .transform((id) => Number(id))
            .refine((id) => !isNaN(id), { message: errorMessages.PRODUCT_ID_MUST_BE_A_NUMBER }),
    }),
});
