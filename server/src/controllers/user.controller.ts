import { Request, Response } from 'express';
import { statusCodes } from '@/constants';
import { userService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const userController = {
    getUsers: asyncRequestHandlerWrapper(
        async (req: Request, res: Response): Promise<void> => {
            const users = await userService.getUsers();

            sendResponse(statusCodes.SUCCESSFUL.OK, { data: { items: users } });
        },
    ),

    getUserByUsername: asyncRequestHandlerWrapper(
        async (req: Request, res: Response): Promise<void> => {
            const { username } = req.params;
            const user = await userService.getUserByUsername(username);

            sendResponse(statusCodes.SUCCESSFUL.OK, { data: user });
        },
    ),
};
