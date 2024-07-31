import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares';
import { mountRoutes } from './routes';

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
mountRoutes(app);
app.use(errorHandler);

export { app };
