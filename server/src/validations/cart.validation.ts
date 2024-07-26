import { z } from 'zod';
import { errorMessages } from '@/constants';

export const createCartItemSchema = z.object({
    params: z.object({
        productId: z
            .string({ message: errorMessages.PRODUCT_ID_INVALID })
            .transform((productId) => Number(productId))
            .refine((productId) => !isNaN(productId), { message: errorMessages.PRODUCT_ID_INVALID }),
        packageId: z
            .string({ message: errorMessages.PACKAGE_ID_INVALID })
            .transform((packageId) => Number(packageId))
            .refine((packageId) => !isNaN(packageId), { message: errorMessages.PACKAGE_ID_INVALID }),
    }),
    body: z.object({
        quantity: z
            .number({ message: errorMessages.QUANTITY_INVALID })
            .refine((quantity) => quantity > 0, { message: errorMessages.QUANTITY_INVALID }),
    }),
});

export const updateCartItemSchema = z.object({
    params: z.object({
        cartItemId: z
            .string({ message: errorMessages.CART_ITEM_ID_INVALID })
            .transform((cartItemId) => Number(cartItemId))
            .refine((cartItemId) => !isNaN(cartItemId), { message: errorMessages.CART_ITEM_ID_INVALID }),
    }),
    body: z.object({
        quantity: z
            .number({ message: errorMessages.QUANTITY_INVALID })
            .refine((quantity) => quantity > 0, { message: errorMessages.QUANTITY_INVALID }),
    }),
});

export const deleteCartItemSchema = z.object({
    params: z.object({
        cartItemId: z
            .string({ message: errorMessages.CART_ITEM_ID_INVALID })
            .transform((cartItemId) => Number(cartItemId))
            .refine((cartItemId) => !isNaN(cartItemId), { message: errorMessages.CART_ID_INVALID }),
    }),
});
