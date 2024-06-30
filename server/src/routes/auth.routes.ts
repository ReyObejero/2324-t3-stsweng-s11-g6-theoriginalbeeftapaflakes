import { Router } from 'express';
import { authController } from '@/controllers';
import { validateBody } from '@/middlewares';
import { loginSchema, signUpSchema } from '@/validations';

const authRouter = Router();
authRouter.post('/login', validateBody(loginSchema), authController.login);
authRouter.post(
    '/register',
    validateBody(signUpSchema),
    authController.register,
);

export { authRouter };
