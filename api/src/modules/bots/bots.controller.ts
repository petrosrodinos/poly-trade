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
            const uuid = req.user!.uuid;

            const bot = await this.botsService.createBot(validatedData, uuid);

            res.status(201).json(bot);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to create bot',
                    error: 'Failed to create bot'
                });
            }
        }
    };

    getAllBots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {

            const validatedQuery = BotQuerySchema.parse(req.query);

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

            const bot = await this.botsService.getBotByUuid(uuid);

            if (!bot) {
                res.status(404).json({
                    message: 'Bot not found'
                });
                return;
            }

            res.status(200).json(bot);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to retrieve bot',
                error: error.message
            });
        }
    };

    updateBot = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { uuid: botUuid } = req.params;
            const validatedData = UpdateBotSchema.parse(req.body);
            const uuid = req.user!.uuid;

            const updatedBot = await this.botsService.updateBot(botUuid, validatedData, uuid);

            if (!updatedBot) {
                res.status(404).json({
                    message: 'Bot not found'
                });
                return;
            }

            res.status(200).json(updatedBot);
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
            const { uuid: botUuid } = req.params;
            const uuid = req.user!.uuid;

            const deleted = await this.botsService.deleteBot(botUuid, uuid);

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

    startAllBots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const uuid = req.user!.uuid;
            const result = await this.botsService.startAllBots();
            res.status(200).json({
                message: 'Bots started successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to start bots',
                error: error.message
            });
        }
    };

    stopAllBots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const uuid = req.user!.uuid;
            const result = await this.botsService.stopAllBots();
            res.status(200).json({
                message: 'Bots stopped successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to stop bots',
                error: error.message
            });
        }
    };

    initializeBots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const bots = await this.botsService.initializeBots();
            res.status(200).json(bots);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to initialize bots',
                error: error.message
            });
        }
    };


    getInMemoryBots = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const bots = await this.botsService.getInMemoryBots();
            res.status(200).json(bots);
        } catch (error: any) {
            res.status(500).json({
                message: 'Failed to get internal bots',
                error: error.message
            });
        }
    };


}
