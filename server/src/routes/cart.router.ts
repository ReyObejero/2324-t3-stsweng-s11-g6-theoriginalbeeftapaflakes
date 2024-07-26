import { Router } from 'express';
import { cartController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { createCartItemSchema } from '@/validations';

const cartRouter = Router();

cartRouter.post('/:productId/:packageId', authenticate, validate(createCartItemSchema), cartController.createCartItem);
cartRouter.get('/', cartController.getCarts);
cartRouter.get('/me', authenticate, cartController.getAuthenticatedUserCart);

export { cartRouter };
