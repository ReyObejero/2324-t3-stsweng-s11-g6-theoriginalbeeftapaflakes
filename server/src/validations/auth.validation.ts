import { z } from 'zod';
import { errorMessages } from '@/constants';

export const loginSchema = z.object({
    body: z.object({
        username: z
            .string({ message: errorMessages.USERNAME_INVALID })
            .min(1, { message: errorMessages.USERNAME_INVALID }),
        password: z
            .string({ message: errorMessages.PASSWORD_INVALID })
            .min(1, { message: errorMessages.PASSWORD_INVALID }),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        username: z
            .string({ message: errorMessages.USERNAME_INVALID })
            .min(1, { message: errorMessages.USERNAME_INVALID }),
        email: z.string({ message: errorMessages.EMAIL_INVALID }).email({ message: errorMessages.EMAIL_INVALID }),
        password: z
            .string({ message: errorMessages.PASSWORD_INVALID })
            .min(1, { message: errorMessages.PASSWORD_INVALID }),
    }),
});
