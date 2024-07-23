import { Router } from 'express';
import { userController } from '@/controllers';
import { authenticate } from '@/middlewares';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/me', authenticate, userController.getMe);
userRouter.get('/:username', userController.getUserByUsername);

export { userRouter };
