import { config } from 'dotenv';
import path from 'path';
import { z } from 'zod';

config({ path: path.resolve(__dirname, '../../.env') });
config({
    path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    server: z.object({
        PORT: z.coerce.number().default(3000),
        HOSTNAME: z.string().default('localhost'),
    }),
    jwt: z.object({
        ACCESS_TOKEN_SECRET: z.string(),
        ACCESS_TOKEN_EXPIRE_TIME: z.string(),
        REFRESH_TOKEN_SECRET: z.string(),
        REFRESH_TOKEN_EXPIRE_TIME: z.string(),
        REFRESH_TOKEN_COOKIE_NAME: z.string(),
    }),
});

export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    server: {
        PORT: process.env.PORT,
        HOSTNAME: process.env.HOSTNAME,
    },
    jwt: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRE_TIME: process.env.ACCESS_TOKEN_EXPIRE_TIME,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_EXPIRE_TIME: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME,
    },
});
