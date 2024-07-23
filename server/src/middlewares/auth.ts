import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { JwtPayload, verify, VerifyErrors } from 'jsonwebtoken';
import { env } from '@/config';
import { statusCodes, validationStrings } from '@/constants';

/**
 * Middleware to verify the JWT access token in the authorization header.
 *
 * @remarks
 * This middleware expects the authorization header to contain a Bearer token. If the token is valid, it passes control
 * to the next middleware function; otherwise, it throws an appropriate HTTP error.
 *
 * @example
 * ```
 * import { verifyAccessToken } from '/path/to/verify-auth';
 * ```
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authorizationHeader = req.headers.authorization;

    const token = authorizationHeader?.split(' ')[1];
    if (!authorizationHeader?.startsWith('Bearer ') || !token) {
        throw createHttpError(statusCodes.clientError.UNAUTHORIZED, validationStrings.TOKEN_NOT_FOUND_IN_AUTH_HEADER);
    }

    verify(
        token,
        env.jwt.ACCESS_TOKEN_SECRET,
        (error: VerifyErrors | null, payload: JwtPayload | string | undefined): void => {
            if (error || !payload || typeof payload === 'string') {
                throw createHttpError(statusCodes.clientError.FORBIDDEN, validationStrings.TOKEN_INVALID);
            }

            req.jwtPayload = {
                userId: payload.userId,
                role: payload.role,
                exp: payload.exp,
            };

            next();
        },
    );
};

export const protect = {};
