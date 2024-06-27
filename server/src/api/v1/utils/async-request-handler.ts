import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response | void>;

export const ASYNC_REQUEST_HANDLER =
    (asyncRequestHandler: AsyncRequestHandler): RequestHandler =>
    (req, res, next) =>
        asyncRequestHandler(req, res, next).catch(next);
