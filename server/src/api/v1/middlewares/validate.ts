import { Request, Response, NextFunction } from 'express';
import { type AnyZodObject } from 'zod';

/**
 * Validates the request object primitives against the provided schema.
 * @param schema Schema of request
 */
export const VALIDATE =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.safeParse(req.body);

        if (!error) {
            next();
        } else {
            const ERRORS = error?.issues.map((err) => ({
                message: err.message,
                location: err.path,
            }));

            res.status(400).json({ error: { errors: ERRORS } });
        }
    };
