import { Router } from 'express';
import { cartController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { deleteCartItemSchema, handleCartItemSchema } from '@/validations';

const cartRouter = Router();

cartRouter.post('/:productId/:packageId', authenticate, validate(handleCartItemSchema), cartController.handleCartItem);
cartRouter.get('/', cartController.getCarts);
cartRouter.get('/me', authenticate, cartController.getAuthenticatedUserCart);
cartRouter.delete('/', authenticate, validate(deleteCartItemSchema), cartController.deleteCarts);
cartRouter.delete('/:productId/:packageId', authenticate, protect, cartController.deleteCartItem);

export { cartRouter };
