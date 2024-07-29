import { Router } from 'express';
import { orderController } from '@/controllers';
import { authenticate, validate } from '@/middlewares';
import { createOrderSchema } from '@/validations';

const orderRouter = Router();

orderRouter.post('/', authenticate, validate(createOrderSchema), orderController.createOrder);
orderRouter.get('/me', authenticate, orderController.getAuthenticatedUserOrders);

export { orderRouter };
