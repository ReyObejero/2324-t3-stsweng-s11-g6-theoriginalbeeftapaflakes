import cookieParser from 'cookie-parser';
import express from 'express';
import createHttpError from 'http-errors';
import { statusCodes, validationStrings } from './constants';
import { errorHandler } from './middlewares';
import { authRouter, userRouter } from './routes';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use((req, res, next) =>
    next(createHttpError(statusCodes.clientError.NOT_FOUND, validationStrings.RESOURCE_NOT_FOUND)),
);
app.use(errorHandler);

export { app };
