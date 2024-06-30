import { Router } from 'express';
import { userController } from '@/controllers';

const userRouter = Router();
userRouter.get('/users', userController.getUsers);
userRouter.get('/users/:username', userController.getUserByUsername);

export { userRouter };
