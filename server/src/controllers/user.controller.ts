import { Request, Response } from 'express';
import { statusCodes } from '@/constants';
import { userService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const userController = {
    getMe: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const user = await userService.getUserById(req!.jwtPayload!.userId);

        sendResponse(res, statusCodes.successful.OK, { data: user });
        return;
    }),

    getUsers: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const users = await userService.getUsers();

        sendResponse(res, statusCodes.successful.OK, {
            data: { items: users },
        });
        return;
    }),

    getUserByUsername: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const user = await userService.getUserByUsername(req.params.username);

        sendResponse(res, statusCodes.successful.OK, { data: user });
        return;
    }),
};
