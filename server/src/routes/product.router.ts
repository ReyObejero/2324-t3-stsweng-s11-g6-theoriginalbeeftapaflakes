import { Router } from 'express';
import { productController } from '@/controllers/product.controller';
import { validate } from '@/middlewares';
import { getProductByIdSchema } from '@/validations/product.validation';

const productRouter = Router();

productRouter.get('/', productController.getProducts);
productRouter.get('/:productId', validate(getProductByIdSchema), productController.getProductById);

export { productRouter };
