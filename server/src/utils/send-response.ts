import { Request, Response, RequestHandler } from 'express';

interface ResponsePayload {
    data?: object;
    error?: object;
}

export const sendResponse =
    (statusCode: number, payload: ResponsePayload): RequestHandler =>
    (req: Request, res: Response): void => {
        res.status(statusCode).json(payload);
    };
