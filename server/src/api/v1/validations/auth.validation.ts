import { z } from 'zod';

export const LOGIN_SCHEMA = z.object({
    username: z.string(),
    password: z.string(),
});

export const SIGN_UP_SCHEMA = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});
