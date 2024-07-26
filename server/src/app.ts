import cookieParser from 'cookie-parser';
import express from 'express';
import createError from 'http-errors';
import { errorMessages, statusCodes } from './constants';
import { errorHandler } from './middlewares';
import { authRouter, cartRouter, productRouter, userRouter } from './routes';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

app.use((req, res, next) => next(createError(statusCodes.clientError.NOT_FOUND, errorMessages.RESOURCE_NOT_FOUND)));
app.use(errorHandler);

export { app };
