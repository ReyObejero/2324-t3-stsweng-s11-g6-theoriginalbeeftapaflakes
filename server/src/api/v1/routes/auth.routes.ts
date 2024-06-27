import { Router } from 'express';
import { AUTH_CONTROLLER } from '../controllers';
import { VALIDATE } from '../middlewares';
import { LOGIN_SCHEMA, SIGN_UP_SCHEMA } from '../validations';

const AUTH_ROUTER = Router();
AUTH_ROUTER.post('/login', VALIDATE(LOGIN_SCHEMA), AUTH_CONTROLLER.login);
AUTH_ROUTER.post('/sign-up', VALIDATE(SIGN_UP_SCHEMA), AUTH_CONTROLLER.signUp);

export { AUTH_ROUTER };
