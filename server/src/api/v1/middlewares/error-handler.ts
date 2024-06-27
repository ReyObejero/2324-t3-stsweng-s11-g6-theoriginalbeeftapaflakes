import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../interfaces';

/**
 * Handles thrown errors.
 * @param err Error object with properties of message and status code
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */
export const ERROR_HANDLER = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.status((err.statusCode = 500)).json({
        error: { message: err.message },
    });
};
