import express from 'express';
import { AUTH_ROUTER, USER_ROUTER } from './api/v1/routes';
import { ERROR_HANDLER } from './api/v1/middlewares';

const APP = express();
APP.use(express.json());
APP.use('/api/v1', AUTH_ROUTER);
APP.use('/api/v1', USER_ROUTER);
APP.use(ERROR_HANDLER);

export { APP };
