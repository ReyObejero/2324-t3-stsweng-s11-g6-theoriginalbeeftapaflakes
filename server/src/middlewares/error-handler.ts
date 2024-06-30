import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '@/utils/send-response';

interface HttpError {
    statusCode?: number;
    message?: String;
}

/**
 * A middleware function that catches and processes errors.
 *
 * @example
 * ```
 * import { errorHandler } from './path/to/handler';
 *
 * app.use(SOME_MIDDLEWARE);
 * // Mount handler after other app.use() and routes calls
 * app.use(errorHandler);
 * ```
 *
 * @param err - The error object to handle
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export const errorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    sendResponse((err.statusCode = 500), {
        error: { message: (err.message = 'Internal server error.') },
    });
};
