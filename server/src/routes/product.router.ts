import { Router } from 'express';
import { productController } from '@/controllers/product.controller';

const productRouter = Router();

productRouter.get('/', productController.getProducts);
productRouter.get('/:productId', productController.getProductById);

export { productRouter };
