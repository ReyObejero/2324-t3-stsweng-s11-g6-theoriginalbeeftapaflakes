import express from 'express';
import { authRouter, userRouter } from './routes';
import { errorHandler } from './middlewares';

const app = express();
app.use(express.json());
app.use('/api/v1', authRouter);
app.use('/api/v1', userRouter);
app.use(errorHandler);

export { app };
