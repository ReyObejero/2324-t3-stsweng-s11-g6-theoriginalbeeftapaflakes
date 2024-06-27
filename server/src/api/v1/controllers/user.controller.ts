import { Request, Response } from 'express';
import { USER_SERVICE } from '../services';
import { ASYNC_REQUEST_HANDLER } from '../utils';

export const USER_CONTROLLER = {
    /**
     * Deletes all user records.
     */
    deleteAllUsers: ASYNC_REQUEST_HANDLER(
        async (req: Request, res: Response) => {
            await USER_SERVICE.deleteAllUsers();

            res.status(204).json({ data: { deleted: true } });
        },
    ),

    /**
     * Retrieves all user records.
     */
    getAllUsers: ASYNC_REQUEST_HANDLER(async (req: Request, res: Response) => {
        const USERS = await USER_SERVICE.getAllUsers();

        res.status(200).json({ data: { items: USERS } });
    }),

    /**
     * Retrieves a unique user record whose email property matches the input email.
     */
    getUserByEmail: ASYNC_REQUEST_HANDLER(
        async (req: Request, res: Response) => {
            const email = req.params.email;
            const USER = await USER_SERVICE.getUserByEmail(email);

            if (USER) {
                res.status(200).json({ data: USER });
            } else {
                res.status(404).json({
                    error: {
                        message: `User with email "${email}" does not exist`,
                    },
                });
            }
        },
    ),

    /**
     * Retrieves a unique user record whose username property matches the input username.
     */
    getUserByUsername: ASYNC_REQUEST_HANDLER(
        async (req: Request, res: Response) => {
            const username = req.params.username;
            const USER = await USER_SERVICE.getUserByUsername(username);

            if (USER) {
                res.status(200).json({ data: USER });
            } else {
                res.status(404).json({
                    error: {
                        message: `User with username '${username}' does not exist`,
                    },
                });
            }
        },
    ),
};
