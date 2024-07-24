import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { userService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const userController = {
    getMe: async (req: Request, res: Response): Promise<void> => {
        const user = await userService.getUserById(req!.jwtPayload!.userId);

        return sendResponse(res, statusCodes.successful.OK, { data: user });
    },

    getUsers: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const users = await userService.getUsers();

        return sendResponse(res, statusCodes.successful.OK, {
            data: { items: users },
        });
    }),

    getUserByUsername: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const user = await userService.getUserByUsername(req.params.username);

        return sendResponse(res, statusCodes.successful.OK, { data: user });
    }),
};
