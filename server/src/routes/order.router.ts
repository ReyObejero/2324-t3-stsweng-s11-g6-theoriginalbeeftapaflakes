import { Router } from 'express';
import { orderController } from '@/controllers';
import { authenticate } from '@/middlewares';

const orderRouter = Router();

orderRouter.post('/', authenticate, orderController.createOrder);

export { orderRouter };
