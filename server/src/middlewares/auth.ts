import { type NextFunction, type Request, type Response } from 'express';
import createError from 'http-errors';
import { verify, type JwtPayload, type VerifyErrors } from 'jsonwebtoken';
import { env } from '@/config';
import { errorMessages, statusCodes } from '@/constants';

/**
 * Middleware to verify the JWT access token in the authorization header.
 *
 * @remarks
 * This middleware expects the authorization header to contain a Bearer token. If the token is valid, it passes control
 * to the next middleware function; otherwise, it throws an appropriate HTTP error.
 *
 * @example
 * ```
 * import { authenticate } from '/path/to/verify-auth';
 *
 * app.post('/some-endpoint', authenticate, async (req, res) => {
 *     // Some action...
 * });
 * ```
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const accessToken = req.cookies[env.jwt.ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
        return next(
            createError(
                statusCodes.clientError.UNAUTHORIZED,
                accessToken === undefined ? errorMessages.TOKEN_NOT_FOUND : errorMessages.TOKEN_INVALID,
            ),
        );
    }

    verify(
        accessToken,
        env.jwt.ACCESS_TOKEN_SECRET,
        (error: VerifyErrors | null, payload: JwtPayload | string | undefined): void => {
            if (error || !payload || typeof payload === 'string') {
                return next(createError(statusCodes.clientError.UNAUTHORIZED, errorMessages.TOKEN_INVALID));
            }

            req.jwtPayload = {
                userId: payload.userId,
                role: payload.role,
                exp: payload.exp,
            };

            return next();
        },
    );
};

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    if (req.jwtPayload?.role !== 'ADMIN') {
        next(createError(statusCodes.clientError.FORBIDDEN, errorMessages.ACCESS_DENIED));
    }

    return next();
};
