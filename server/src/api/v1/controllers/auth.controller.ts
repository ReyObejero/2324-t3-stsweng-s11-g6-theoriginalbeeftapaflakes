import { Request, Response } from 'express';
import { AUTH_SERVICE } from '../services';
import { ASYNC_REQUEST_HANDLER } from '../utils';

export const AUTH_CONTROLLER = {
    /**
     * Performs authentication and generates JWT tokens when necessary.
     */
    login: ASYNC_REQUEST_HANDLER(async (req: Request, res: Response) => {
        const { username, password } = req.body;
        const ACCESS_TOKEN = await AUTH_SERVICE.login(username, password);

        res.status(200).json({});
    }),

    /**
     * Creates a new user record with input username, email, and password.
     */
    signUp: ASYNC_REQUEST_HANDLER(async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const USER = await AUTH_SERVICE.signUp(username, email, password);

        res.status(201).json({ data: USER });
    }),
};
