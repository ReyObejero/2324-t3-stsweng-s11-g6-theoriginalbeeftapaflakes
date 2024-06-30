import { Request, Response, NextFunction, RequestHandler } from 'express';
import { type AnyZodObject } from 'zod';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils';

/**
 * Validates the request object body against a provided Zod schema.
 *
 * @example
 * ```
 * import { z } from 'zod';
 * import { validate } from './path/to/validate';
 *
 * const someSchema = z.object({
 *     someProperty: z.number(),
 *     someOtherProperty: z.string(),
 * });
 *
 * app.post('/some-endpoint', validate(someSchema), async (req, res) => {
 *     // Values are guaranteed to be valid
 *     const { someProperty, someOtherProperty } = req.body;
 *     const someValue = someService.someMethod(
 *         someProperty,
 *         someOtherProperty
 *     );
 *
 *     res.status(201).json({ data: someValue });
 * });
 * ```
 *
 * @param schema - The Zod schema to validate against
 * @returns A middleware function that validates the request body
 */
export const validateBody =
    (schema: AnyZodObject): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.safeParse(req.body);

        if (!error) {
            next();
        } else {
            const errors = error?.issues.map((err) => ({
                message: err.message,
            }));

            sendResponse(statusCodes.CLIENT_ERROR.BAD_REQUEST, {
                error: { errors },
            });
        }
    };
