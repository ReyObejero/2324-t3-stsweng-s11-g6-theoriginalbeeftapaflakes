import { Router } from 'express';
import { reportController } from '@/controllers';

const reportRouter = Router();

reportRouter.get('/sales', reportController.getSales);

export { reportRouter };
