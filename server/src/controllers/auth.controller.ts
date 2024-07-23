import { Request, Response } from 'express';
import { env } from '@/config';
import { statusCodes } from '@/constants';
import { authService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse, timeStringToMilliseconds } from '@/utils';

export const authController = {
    login: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { accessToken, refreshToken } = await authService.login(
            req.body,
            req.cookies[env.jwt.REFRESH_TOKEN_COOKIE_NAME],
        );

        res.clearCookie(env.jwt.REFRESH_TOKEN_COOKIE_NAME);
        res.cookie(env.jwt.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            maxAge: timeStringToMilliseconds(env.jwt.REFRESH_TOKEN_EXPIRE_TIME),
            sameSite: 'none',
        });

        sendResponse(res, statusCodes.successful.CREATED, { data: { accessToken } });
        return;
    }),

    register: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const user = await authService.register(req.body);

        sendResponse(res, statusCodes.successful.CREATED, { data: user });
        return;
    }),
};
