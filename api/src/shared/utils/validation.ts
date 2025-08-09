import { Response } from 'express';
import { z } from 'zod';

export const handleValidationError = (error: z.ZodError, res: Response): void => {
    res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }))
    });
};

export const validateRequest = <T>(
    schema: z.ZodSchema<T>,
    data: unknown
): T => {
    return schema.parse(data);
};
