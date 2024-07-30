import { Router } from 'express';
import { reportController } from '@/controllers';
import { authenticate, protect } from '@/middlewares';

const reportRouter = Router();

reportRouter.get('/sales', authenticate, protect, reportController.getSales);

export { reportRouter };
