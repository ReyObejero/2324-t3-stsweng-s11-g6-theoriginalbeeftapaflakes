import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config';
import { errorHandler } from './middlewares';
import { mountRoutes } from './routes';

const app = express();
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
    }),
);
app.use(express.json());
mountRoutes(app);
app.use(errorHandler);

export { app };
