import { Router } from 'express';
import { cartController } from '@/controllers';
import { authenticate, protect, validate } from '@/middlewares';
import { handlecartItemSchema } from '@/validations';

const cartRouter = Router();

cartRouter.post('/:productId/:packageId', authenticate, validate(handlecartItemSchema), cartController.handleCartItem);
cartRouter.get('/', cartController.getCarts);
cartRouter.get('/me', authenticate, cartController.getAuthenticatedUserCart);
cartRouter.delete('/', authenticate, cartController.deleteCarts);
cartRouter.delete('/:productId/:packageId', authenticate, protect, cartController.deleteCartItem);

export { cartRouter };
