import { Response } from 'express';
import { CreateCredentialsSchema, UpdateCredentialsSchema, CredentialsQuerySchema } from './dto/credentials.dto';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';
import { CredentialsService } from './credentials.service';

export class CredentialsController {
    private credentialsService: CredentialsService;

    constructor() {
        this.credentialsService = new CredentialsService();
    }

    createCredentials = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const validatedData = CreateCredentialsSchema.parse(req.body);
            const user_uuid = req.user!.uuid;

            const credentials = await this.credentialsService.createCredentials(validatedData, user_uuid);

            res.status(201).json(credentials);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to create credentials',
                    error: error.message
                });
            }
        }
    };

    getAllCredentials = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const validatedQuery = CredentialsQuerySchema.parse({
                ...req.query,
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined
            });
            const user_uuid = req.user!.uuid;

            const result = await this.credentialsService.getAllCredentials(validatedQuery, user_uuid);

            res.status(200).json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to retrieve credentials',
                    error: error.message
                });
            }
        }
    };


    updateCredentials = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { uuid } = req.params;
            const validatedData = UpdateCredentialsSchema.parse(req.body);
            const user_uuid = req.user!.uuid;

            const credentials = await this.credentialsService.updateCredentials(uuid, validatedData, user_uuid);

            if (!credentials) {
                res.status(404).json({
                    message: 'Credentials not found'
                });
                return;
            }

            res.status(200).json(credentials);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to update credentials',
                    error: error.message
                });
            }
        }
    };

    deleteCredential = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { uuid } = req.params;
            const user_uuid = req.user!.uuid;

            const credentials = await this.credentialsService.deleteCredential(uuid, user_uuid);

            if (!credentials) {
                res.status(404).json({
                    message: 'Credentials not found'
                });
                return;
            }

            res.status(200).json({
                message: 'Credentials deleted successfully',
                credentials
            });
        } catch (error: any) {
            res.status(400).json({
                message: 'Failed to delete credentials',
                error: error.message
            });
        }
    };

    deleteAllCredentials = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            await this.credentialsService.deleteAllCredentials();

            res.status(200).json({
                message: 'All credentials deleted successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                message: 'Failed to delete all credentials',
                error: error.message
            });
        }
    };

    getUserCredential = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const user_uuid = req.user!.uuid;

            const credentials = await this.credentialsService.getUserCredential(user_uuid);

            res.status(200).json(credentials);
        } catch (error: any) {
            res.status(400).json({
                message: 'Failed to delete credentials',
                error: error.message
            });
        }
    };


}
