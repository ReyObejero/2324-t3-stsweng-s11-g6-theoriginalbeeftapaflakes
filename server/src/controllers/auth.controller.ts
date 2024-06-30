import { Request, Response } from 'express';
import { statusCodes } from '@/constants';
import { authService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const authController = {
    login: asyncRequestHandlerWrapper(
        async (req: Request, res: Response): Promise<void> => {
            const { username, password } = req.body;
            const accessToken = await authService.login(username, password);

            sendResponse(statusCodes.SUCCESSFUL.ACCEPTED, {
                data: { accessToken },
            });
        },
    ),

    register: asyncRequestHandlerWrapper(
        async (req: Request, res: Response): Promise<void> => {
            const { username, email, password } = req.body;
            const user = await authService.register(username, email, password);

            sendResponse(statusCodes.SUCCESSFUL.CREATED, { data: user });
        },
    ),
};
