import { Response } from 'express';
import { CreateBotSchema, UpdateBotSchema, BotQuerySchema } from './dto/bot.dto';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';
import { BotsService } from './bots.service';

export class BotsController {
    private botsService: BotsService;

    constructor() {
        this.botsService = new BotsService();
    }

    createBot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const validatedData = CreateBotSchema.parse(req.body);
            const user_id = req.user!.user_id;

            const bot = await this.botsService.createBot(validatedData, user_id);

            res.status(201).json({
                message: 'Bot created successfully',
                data: bot
            });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to create bot',
                    error: error.message
                });
            }
        }
    };

    getAllBots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const queryParams = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                symbol: req.query.symbol as string,
                active: req.query.active ? req.query.active === 'true' : undefined,
                timeframe: req.query.timeframe as string
            };

            const validatedQuery = BotQuerySchema.parse(queryParams);

            const result = await this.botsService.getAllBots(validatedQuery);

            res.status(200).json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to retrieve bots',
                    error: error.message
                });
            }
        }
    };

    getBotByUuid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { uuid } = req.params;
            const user_id = req.user!.user_id;

            const bot = await this.botsService.getBotByUuid(uuid, user_id);

            if (!bot) {
                res.status(404).json({
                    message: 'Bot not found'
                });
                return;
            }

            res.status(200).json({
                message: 'Bot retrieved successfully',
                data: bot
            });
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to retrieve bot',
                error: error.message
            });
        }
    };

    updateBot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { uuid } = req.params;
            const validatedData = UpdateBotSchema.parse(req.body);
            const user_id = req.user!.user_id;

            const updatedBot = await this.botsService.updateBot(uuid, validatedData, user_id);

            if (!updatedBot) {
                res.status(404).json({
                    message: 'Bot not found'
                });
                return;
            }

            res.status(200).json({
                message: 'Bot updated successfully',
                data: updatedBot
            });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to update bot',
                    error: error.message
                });
            }
        }
    };

    deleteBot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { uuid } = req.params;
            const user_id = req.user!.user_id;

            const deleted = await this.botsService.deleteBot(uuid, user_id);

            if (!deleted) {
                res.status(404).json({
                    message: 'Bot not found'
                });
                return;
            }

            res.status(200).json({
                message: 'Bot deleted successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to delete bot',
                error: error.message
            });
        }
    };



}
