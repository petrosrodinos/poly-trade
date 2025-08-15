import { Response } from 'express';
import { CreateBotSubscriptionSchema, UpdateBotSubscriptionSchema, BotSubscriptionQuerySchema } from './dto/bot-subscription.dto';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { handleValidationError } from '../../shared/utils/validation';
import { z } from 'zod';
import { BotSubscriptionsService } from './bot-subscriptions.service';

export class BotSubscriptionsController {
    private botSubscriptionsService: BotSubscriptionsService;

    constructor() {
        this.botSubscriptionsService = new BotSubscriptionsService();
    }

    createBotSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const validatedData = CreateBotSubscriptionSchema.parse(req.body);
            const user_uuid = req.user!.uuid;

            const subscription = await this.botSubscriptionsService.createBotSubscription(validatedData, user_uuid);

            res.status(201).json(subscription);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to create bot subscription',
                    error: error.message
                });
            }
        }
    };

    getAllBotSubscriptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const queryParams = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                bot_id: req.query.bot_id ? parseInt(req.query.bot_id as string) : undefined,
                active: req.query.active ? req.query.active === 'true' : undefined,
                user_id: req.query.user_id ? parseInt(req.query.user_id as string) : undefined
            };

            const validatedQuery = BotSubscriptionQuerySchema.parse(queryParams);
            const user_uuid = req.user!.uuid;

            const result = await this.botSubscriptionsService.getAllBotSubscriptions(validatedQuery, user_uuid);

            res.status(200).json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else {
                res.status(400).json({
                    message: 'Failed to retrieve bot subscriptions',
                    error: error.message
                });
            }
        }
    };



    updateBotSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const uuid = req.params.uuid;
            const user_uuid = req.user!.uuid;

            if (!uuid) {
                res.status(400).json({
                    message: 'Invalid subscription ID'
                });
                return;
            }

            const validatedData = UpdateBotSubscriptionSchema.parse(req.body);

            const subscription = await this.botSubscriptionsService.updateBotSubscription(uuid, validatedData, user_uuid);

            res.status(200).json(subscription);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
            } else if (error.message === 'Bot subscription not found') {
                res.status(404).json({
                    message: 'Bot subscription not found'
                });
            } else {
                res.status(400).json({
                    message: 'Failed to update bot subscription',
                    error: error.message
                });
            }
        }
    };

    deleteBotSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const uuid = req.params.uuid;
            const user_uuid = req.user!.uuid;

            if (!uuid) {
                res.status(400).json({
                    message: 'Invalid subscription ID'
                });
                return;
            }

            await this.botSubscriptionsService.deleteBotSubscription(uuid, user_uuid);

            res.status(200).json({
                message: 'Bot subscription deleted successfully'
            });
        } catch (error: any) {
            if (error.message === 'Bot subscription not found') {
                res.status(404).json({
                    message: 'Bot subscription not found'
                });
            } else {
                res.status(400).json({
                    message: 'Failed to delete bot subscription',
                    error: error.message
                });
            }
        }
    };


    getBotSubscriptionByBotUuid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const bot_uuid = req.params.bot_uuid;
            const user_uuid = req.user!.uuid;

            const subscription = await this.botSubscriptionsService.getBotSubscriptionByBotUuid(bot_uuid, user_uuid);

            res.status(200).json(subscription);
        } catch (error: any) {
            if (error.message === 'Bot subscription not found') {
                res.status(404).json({
                    message: 'Bot subscription not found'
                });
            } else {
                res.status(400).json({
                    message: 'Failed to retrieve bot subscription',
                    error: error.message
                });
            }
        }
    };

    startAllBotSubscriptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const user_uuid = req.user!.uuid;

            const result = await this.botSubscriptionsService.startAllBotSubscriptions(user_uuid);

            res.status(200).json({
                message: 'All bot subscriptions started successfully',
                result
            });
        } catch (error: any) {
            res.status(400).json({
                message: 'Failed to start all bot subscriptions',
                error: error.message
            });
        }
    };

    stopAllBotSubscriptions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const user_uuid = req.user!.uuid;

            const result = await this.botSubscriptionsService.stopAllBotSubscriptions(user_uuid);

            res.status(200).json({
                message: 'All bot subscriptions stopped successfully',
                result
            });
        } catch (error: any) {
            res.status(400).json({
                message: 'Failed to stop all bot subscriptions',
                error: error.message
            });
        }
    };


}
