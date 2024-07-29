import { z } from 'zod';
import { errorMessages } from '@/constants';

export const createOrderSchema = z.object({
    body: z.object({
        productId: z.number({ message: errorMessages.PRODUCT_ID_INVALID }),
        packageId: z.number({ message: errorMessages.PACKAGE_ID_INVALID }),
        quantity: z.number({ message: errorMessages.QUANTITY_INVALID }),
        price: z.number({ message: errorMessages.PRICE_INVALID }),
        cardNumber: z.string({ message: errorMessages.CARD_NUMBER_INVALID }),
        cardExpirationYear: z.string({ message: errorMessages.CARD_EXPIRATION_DATE_INVALID }),
        cardExpirationMonth: z.string({ message: errorMessages.CARD_EXPIRATION_DATE_INVALID }),
        cardSecurityCode: z.string({ message: errorMessages.CARD_SECURITY_CODE_INVALID }),
    }),
});
