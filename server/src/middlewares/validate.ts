import { Request, Response, NextFunction, RequestHandler } from 'express';
import { type AnyZodObject } from 'zod';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils';

/**
 * Validates the request object against a provided Zod schema.
 *
 * @example
 * ```
 * import { z } from 'zod';
 * import { validate } from '/path/to/validate';
 *
 * const someSchema = z.object({
 *     body: z.object({
 *        someProperty: z.number(),
 *        someOtherProperty: z.string(),
 *     }),
 * });
 *
 * app.post('/some-endpoint', validate(someSchema), async (req, res) => {
 *     // Values are guaranteed to be valid
 *     const someValue = someService.someMethod(req.body);
 *
 *     res.status(201).json({ data: someValue });
 * });
 * ```
 *
 * @param schema - The Zod schema to validate against
 * @returns A middleware function that validates the request
 */
export const validate =
    (schema: AnyZodObject): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.safeParse(req);
        if (error) {
            const errors = error?.issues.map((err) => ({
                message: err.message,
            }));

            sendResponse(res, statusCodes.clientError.BAD_REQUEST, {
                error: errors.length === 1 ? errors[0] : { errors },
            });
            return;
        }

        next();
    };
