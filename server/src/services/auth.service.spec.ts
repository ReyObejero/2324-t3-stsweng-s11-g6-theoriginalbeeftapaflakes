import { User } from '@prisma/client';
import { authService } from './auth.service';
import { userService } from './user.service';
import { tokenService } from './token.service';
import { generateAccessToken, generateRefreshToken } from '@/utils';
import { errorMessages, statusCodes } from '@/constants';
import createError from 'http-errors';
import { hash, verify } from 'argon2';
import { prismaClient } from '@/database';

jest.mock('./user.service');
jest.mock('./token.service');
jest.mock('@/utils', () => ({
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
}));

jest.mock('argon2', () => ({
    hash: jest.fn(),
    verify: jest.fn(),
}));

jest.mock('@/database', () => ({
    prismaClient: {
        user: {
            create: jest.fn(),
        },
    },
}));

describe('authService', () => {
    describe('login', () => {
        it('should throw error if username is missing', async () => {
            const input = { username: '', password: 'password' };
            await expect(authService.login(input, '')).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID)
            );
        });

        it('should throw error if password is missing', async () => {
            const input = { username: 'username', password: '' };
            await expect(authService.login(input, '')).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PASSWORD_INVALID)
            );
        });

        it('should throw error if user is not found', async () => {
            (userService.getUserByUsername as jest.Mock).mockResolvedValue(null);
            const input = { username: 'username', password: 'password' };
            await expect(authService.login(input, '')).rejects.toThrow(
                createError(statusCodes.clientError.NOT_FOUND, errorMessages.USERNAME_INVALID)
            );
        });

        it('should throw error if password is incorrect', async () => {
            const mockUser = { id: 1, username: 'username', password: 'hashedPassword', role: 'USER' } as User;
            (userService.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
            (verify as jest.Mock).mockResolvedValue(false);

            const input = { username: 'username', password: 'wrongPassword' };
            await expect(authService.login(input, '')).rejects.toThrow(
                createError(statusCodes.clientError.UNAUTHORIZED, errorMessages.PASSWORD_INVALID)
            );
        });

        it('should return accessToken, refreshToken and user if login is successful', async () => {
            const mockUser = { id: 1, username: 'username', password: 'hashedPassword', role: 'USER' } as User;
            (userService.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
            (verify as jest.Mock).mockResolvedValue(true);
            (generateAccessToken as jest.Mock).mockReturnValue('accessToken');
            (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
            (tokenService.createRefreshToken as jest.Mock).mockResolvedValue(null);

            const input = { username: 'username', password: 'password' };
            const result = await authService.login(input, '');

            expect(result).toEqual({
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                user: mockUser,
            });
        });
    });

    describe('register', () => {
        it('should throw error if username is missing', async () => {
            const input = { username: '', email: 'email@test.com', password: 'password' };
            await expect(authService.register(input)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID)
            );
        });

        it('should throw error if email is missing', async () => {
            const input = { username: 'username', email: '', password: 'password' };
            await expect(authService.register(input)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.EMAIL_INVALID)
            );
        });

        it('should throw error if password is missing', async () => {
            const input = { username: 'username', email: 'email@test.com', password: '' };
            await expect(authService.register(input)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_INVALID)
            );
        });

        it('should throw error if username already exists', async () => {
            (userService.getUserByUsername as jest.Mock).mockResolvedValue({} as User);
            const input = { username: 'username', email: 'email@test.com', password: 'password' };
            await expect(authService.register(input)).rejects.toThrow(
                createError(statusCodes.clientError.CONFLICT, errorMessages.USERNAME_ALREADY_IN_USE)
            );
        });

        it('should throw error if email already exists', async () => {
            (userService.getUserByUsername as jest.Mock).mockResolvedValue(null);
            (userService.getUserByEmail as jest.Mock).mockResolvedValue({} as User);
            const input = { username: 'username', email: 'email@test.com', password: 'password' };
            await expect(authService.register(input)).rejects.toThrow(
                createError(statusCodes.clientError.CONFLICT, errorMessages.EMAIL_ALREADY_IN_USE)
            );
        });

        it('should return the created user if registration is successful', async () => {
            (userService.getUserByUsername as jest.Mock).mockResolvedValue(null);
            (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
            (hash as jest.Mock).mockResolvedValue('hashedPassword');
            const mockUser = { id: 1, username: 'username', email: 'email@test.com', password: 'hashedPassword' } as User;
            (prismaClient.user.create as jest.Mock).mockResolvedValue(mockUser);

            const input = { username: 'username', email: 'email@test.com', password: 'password' };
            const result = await authService.register(input);

            expect(result).toEqual(mockUser);
        });
    });
});
