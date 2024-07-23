import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils';

/**
 * A middleware function that catches and processes errors.
 *
 * @example
 * ```
 * import { errorHandler } from '/path/to/error-handler';
 *
 * app.use(someMiddleware);
 * // Mount handler after other app.use() and routes calls
 * app.use(errorHandler);
 * ```
 *
 * @param err - The error object to handle
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        next(err);
    }

    sendResponse(res, err.statusCode ? err.statusCode : statusCodes.serverError.INTERNAL_SERVER_ERROR, {
        error: { message: err.message ? err.message : 'Internal Server Error' },
    });
    return;
};
