import { Router } from 'express';
import { USER_CONTROLLER } from '../controllers';

const USER_ROUTER = Router();
USER_ROUTER.get('/users', USER_CONTROLLER.getAllUsers);
USER_ROUTER.get('/users/:username', USER_CONTROLLER.getUserByUsername);
USER_ROUTER.delete('/users', USER_CONTROLLER.deleteAllUsers);

export { USER_ROUTER };
