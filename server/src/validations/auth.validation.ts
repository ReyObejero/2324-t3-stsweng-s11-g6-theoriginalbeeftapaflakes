import { z } from 'zod';
import { errorMessages } from '@/constants';

export const loginSchema = z.object({
    body: z.object({
        username: z.string({ message: errorMessages.USERNAME_REQUIRED }),
        password: z.string({ message: errorMessages.PASSWORD_REQUIRED }),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        username: z.string({ message: errorMessages.USERNAME_REQUIRED }),
        email: z.string({ message: errorMessages.EMAIL_REQUIRED }).email({ message: errorMessages.EMAIL_INVALID }),
        password: z.string({ message: errorMessages.PASSWORD_REQUIRED }),
    }),
});
