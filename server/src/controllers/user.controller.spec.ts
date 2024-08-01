import { Request, Response, NextFunction } from 'express';
import { userController } from '@/controllers/user.controller';
import { userService } from '@/services';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils/send-response';

jest.mock('@/services/user.service');
jest.mock('@/utils/send-response', () => ({
    sendResponse: jest.fn()
}));


describe('User Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            jwtPayload: {
                userId: 1, // Assume the userId is a number
                role: 'USER' // Add role property if required
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn() as NextFunction;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAuthenticatedUser', () => {
        it('should get the authenticated user', async () => {
            const user = { id: 1, username: 'testuser' };

            (userService.getUserById as jest.Mock).mockResolvedValue(user);

            await userController.getAuthenticatedUser(req as Request, res as Response);

            expect(userService.getUserById).toHaveBeenCalledWith(1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: user });
        });
    });

    describe('getUser', () => {
        it('should get a user by username', async () => {
            const user = { id: 1, username: 'testuser' };
            req.params = { username: 'testuser' };

            (userService.getUserByUsername as jest.Mock).mockResolvedValue(user);

            await userController.getUser(req as Request, res as Response, next);

            expect(userService.getUserByUsername).toHaveBeenCalledWith('testuser');
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: user });
        });
    });

    describe('getUsers', () => {
        it('should get all users', async () => {
            const users = [{ id: 1, username: 'testuser' }];

            (userService.getUsers as jest.Mock).mockResolvedValue(users);

            await userController.getUsers(req as Request, res as Response, next);

            expect(userService.getUsers).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { items: users } });
        });
    });
});
