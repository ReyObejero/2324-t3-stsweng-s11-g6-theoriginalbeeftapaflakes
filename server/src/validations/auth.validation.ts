import { z } from 'zod';
import { validationStrings } from '@/constants';

export const loginSchema = z.object({
    body: z.object({
        username: z.string({ message: validationStrings.USERNAME_REQUIRED }),
        password: z.string({ message: validationStrings.PASSWORD_REQUIRED }),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        username: z.string({ message: validationStrings.USERNAME_REQUIRED }),
        email: z
            .string({ message: validationStrings.EMAIL_REQUIRED })
            .email({ message: validationStrings.EMAIL_INVALID }),
        password: z.string({ message: validationStrings.PASSWORD_REQUIRED }),
    }),
});
