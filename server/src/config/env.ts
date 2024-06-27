import { config } from 'dotenv';
import path from 'path';
import { z } from 'zod';

config({ path: path.resolve(__dirname, '../../.env') });
config({
    path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

export const ENV = {
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .parse(process.env.NODE_ENV),
    server: {
        PORT: z.coerce.number().default(3000).parse(process.env.PORT),
        HOSTNAME: z.string().default('localhost').parse(process.env.HOSTNAME),
    },
    jwt: {
        ACCESS_TOKEN_SECRET: z.string().parse(process.env.ACCESS_TOKEN_SECRET),
        ACCESS_TOKEN_EXPIRE_TIME: z.coerce
            .number()
            .parse(process.env.ACCESS_TOKEN_EXPIRE_TIME),
    },
};
