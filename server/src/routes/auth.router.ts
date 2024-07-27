import { Router } from 'express';
import { authController } from '@/controllers';
import { validate } from '@/middlewares';
import { loginSchema, registerSchema } from '@/validations';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/register', validate(registerSchema), authController.register);

export { authRouter };
