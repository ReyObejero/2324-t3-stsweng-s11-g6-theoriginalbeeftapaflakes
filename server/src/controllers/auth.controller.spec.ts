import { Request, Response, NextFunction } from 'express';
import { authController } from '@/controllers/auth.controller';
import { authService } from '@/services';
import { env } from '@/config';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils/send-response';
import { timeStringToMilliseconds } from '@/utils/parse-time';

jest.mock('@/services/auth.service');
jest.mock('@/utils/send-response');
jest.mock('@/utils/parse-time');

describe('authController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    const mockUser = { id: 1, name: 'testUser' };
    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';
    const mockAccessTokenExpireTime = '1h';
    const mockRefreshTokenExpireTime = '7d';

    beforeEach(() => {
        req = {
            body: { username: 'test', password: 'password' },
            cookies: { [env.jwt.REFRESH_TOKEN_COOKIE_NAME]: 'existingRefreshToken' },
            jwtPayload: { userId: 1, role: 'USER' }
        } as Partial<Request>; 

        res = {
            cookie: jest.fn(),
            clearCookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        (authService.login as jest.Mock).mockResolvedValue({
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken,
            user: mockUser,
        });

        (authService.register as jest.Mock).mockResolvedValue(mockUser);
        (authService.logout as jest.Mock).mockResolvedValue(mockUser);

        (timeStringToMilliseconds as jest.Mock).mockImplementation((timeString) => {
            if (timeString === env.jwt.ACCESS_TOKEN_EXPIRE_TIME) {
                return 3600000; // 1 hour in milliseconds
            }
            if (timeString === env.jwt.REFRESH_TOKEN_EXPIRE_TIME) {
                return 604800000; // 7 days in milliseconds
            }
        });

        env.jwt.ACCESS_TOKEN_EXPIRE_TIME = mockAccessTokenExpireTime;
        env.jwt.REFRESH_TOKEN_EXPIRE_TIME = mockRefreshTokenExpireTime;
    });

    describe('register', () => {
        it('should handle register and send response correctly', async () => {
            const asyncHandler = authController.register;

            await asyncHandler(req as Request, res as Response, {} as NextFunction);

            expect(authService.register).toHaveBeenCalledWith(req.body, req.jwtPayload?.role);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: mockUser });
        });
    });

    describe('login', () => {
        it('should handle login and set cookies correctly', async () => {
            const asyncHandler = authController.login;

            await asyncHandler(req as Request, res as Response, {} as NextFunction);

            expect(authService.login).toHaveBeenCalledWith(
                req.body,
                (req.cookies as any)[env.jwt.REFRESH_TOKEN_COOKIE_NAME]
            );

            expect(res.clearCookie).toHaveBeenCalledWith(env.jwt.ACCESS_TOKEN_COOKIE_NAME);
            expect(res.cookie).toHaveBeenCalledWith(env.jwt.ACCESS_TOKEN_COOKIE_NAME, mockAccessToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true, 
                maxAge: 3600000, 
            });

            expect(res.clearCookie).toHaveBeenCalledWith(env.jwt.REFRESH_TOKEN_COOKIE_NAME);
            expect(res.cookie).toHaveBeenCalledWith(env.jwt.REFRESH_TOKEN_COOKIE_NAME, mockRefreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true, 
                maxAge: 604800000, 
            });

            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: mockUser });
        });
    });

    describe('logout', () => {
        it('should handle logout and clear cookies correctly', async () => {
            const asyncHandler = authController.logout;

            await asyncHandler(req as Request, res as Response, {} as NextFunction);

            expect(authService.logout).toHaveBeenCalledWith(req.jwtPayload!.userId);
            expect(res.clearCookie).toHaveBeenCalledWith(env.jwt.ACCESS_TOKEN_COOKIE_NAME);
            expect(res.clearCookie).toHaveBeenCalledWith(env.jwt.REFRESH_TOKEN_COOKIE_NAME);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: mockUser });
        });
    });
});
