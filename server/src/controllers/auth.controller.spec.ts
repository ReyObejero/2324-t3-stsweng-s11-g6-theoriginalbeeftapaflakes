import { Request, Response, NextFunction } from 'express';
import { authController } from '@/controllers/auth.controller';
import { authService } from '@/services';
import { env } from '@/config';
import { statusCodes } from '@/constants';
import { sendResponse} from '@/utils/send-response';
import { timeStringToMilliseconds } from '@/utils/parse-time';

jest.mock('@/services/auth.service');
jest.mock('@/utils/send-response', () => ({
    sendResponse: jest.fn()
}));
jest.mock('@/utils/parse-time', () => ({
    timeStringToMilliseconds: jest.fn().mockReturnValue(60000) // mock return value
}));



describe('Auth Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {},
            cookies: {} // Initialize cookies as an empty object
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            clearCookie: jest.fn(),
            cookie: jest.fn()
        };
        next = jest.fn() as NextFunction;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should login a user', async () => {
            const user = { id: 1, name: 'Test User' };
            const accessToken = 'access-token';
            const refreshToken = 'refresh-token';

            req.body = { username: 'test', password: 'test' };
            req.cookies![env.jwt.REFRESH_TOKEN_COOKIE_NAME] = 'some-refresh-token'; // Add the exclamation mark to assert non-null

            (authService.login as jest.Mock).mockResolvedValue({ accessToken, refreshToken, user });

            await authController.login(req as Request, res as Response, next);

            expect(authService.login).toHaveBeenCalledWith(req.body, 'some-refresh-token');
            expect(res.clearCookie).toHaveBeenCalledWith(env.jwt.ACCESS_TOKEN_COOKIE_NAME);
            expect(res.cookie).toHaveBeenCalledWith(
                env.jwt.ACCESS_TOKEN_COOKIE_NAME,
                accessToken,
                expect.objectContaining({ maxAge: 60000 })
            );
            expect(res.clearCookie).toHaveBeenCalledWith(env.jwt.REFRESH_TOKEN_COOKIE_NAME);
            expect(res.cookie).toHaveBeenCalledWith(
                env.jwt.REFRESH_TOKEN_COOKIE_NAME,
                refreshToken,
                expect.objectContaining({ maxAge: 60000 })
            );
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: user });
        });
    });

    describe('register', () => {
        it('should register a user', async () => {
            const user = { id: 1, name: 'Test User' };

            req.body = { username: 'test', password: 'test' };

            (authService.register as jest.Mock).mockResolvedValue(user);

            await authController.register(req as Request, res as Response, next);

            expect(authService.register).toHaveBeenCalledWith(req.body);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: user });
        });
    });
});
