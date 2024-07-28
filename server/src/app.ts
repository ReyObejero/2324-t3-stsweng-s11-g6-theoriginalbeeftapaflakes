import cookieParser from 'cookie-parser';
import express from 'express';
import createError from 'http-errors';
import { errorMessages, statusCodes } from './constants';
import { errorHandler } from './middlewares';
import { authRouter, cartRouter, productRouter, reviewRouter, staticPageRouter, userRouter } from './routes';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/carts', cartRouter);
app.use('/products', productRouter);
app.use('/reviews', reviewRouter);
app.use('/static-pages', staticPageRouter);
app.use('/users', userRouter);

app.use((req, res, next) => next(createError(statusCodes.clientError.NOT_FOUND, errorMessages.RESOURCE_NOT_FOUND)));
app.use(errorHandler);

export { app };
