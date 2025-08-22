import { Request, Response } from 'express';
import { ChangePasswordSchema, LoginSchema, RegisterSchema } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { UserErrorCodes } from '../../../shared/errors/user';
import { handleValidationError } from '../../../shared/utils/validation';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/shared/middleware/auth.middleware';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const validatedData = RegisterSchema.parse(req.body);
            const result = await this.authService.register(validatedData);
            res.status(201).json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            }
            if (error.message === UserErrorCodes.USER_ALREADY_EXISTS) {
                res.status(409).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'Failed to register user', error: 'Invalid username or password' });
            }
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const validatedData = LoginSchema.parse(req.body);
            const result = await this.authService.login(validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                res.status(401).json({ message: 'Invalid username or password' });
            } else {
                res.status(400).json({ message: 'Login failed', error: error.message });
            }
        }
    };

    changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const validatedData = ChangePasswordSchema.parse(req.body);
            const result = await this.authService.changePassword(req.user!.uuid, validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Failed to change password', error: error.message });
        }
    };




} 