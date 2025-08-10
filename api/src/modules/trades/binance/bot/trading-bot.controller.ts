import { Request, Response } from 'express';
import { BinanceTradesService } from "../../../../integrations/binance/services/binance-trades.service";
import { BinanceTradingBotService } from './trading-bot.service';
import { logger } from '../../../../shared/utils/logger';
import { BotFormDataSchema, SymbolParamSchema } from './dto/bot.dto';
import { handleValidationError, validateRequest } from '../../../../shared/utils/validation';
import { z } from 'zod';

export class BinanceTradingBotController {
    private binanceTradesService: BinanceTradesService;
    private tradingBotService: BinanceTradingBotService;

    constructor() {
        this.binanceTradesService = new BinanceTradesService();
        this.tradingBotService = new BinanceTradingBotService();
    }

    createBot = async (req: Request, res: Response): Promise<void> => {
        try {


            const validatedData = validateRequest(BotFormDataSchema, req.body);

            const bot = await this.tradingBotService.createBot(validatedData);

            res.status(200).json({ message: `Binance trading bot created for ${validatedData.symbol}`, bot });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
                return;
            }

            console.error(`Failed to create bot:`, error.message);
            res.status(500).json({
                message: `Failed to create bot`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    startBot = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = req.params.id;
            const bot = await this.tradingBotService.getBot(id);

            if (!bot) {
                res.status(404).json({ message: `Bot not found` });
                return;
            }


            await this.tradingBotService.startBot(bot);
            res.status(200).json({ message: `Binance trading bot started for ${bot.id}` });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
                return;
            }

            console.error(`Failed to start bot:`, error);

            if (error.message?.includes('Insufficient balance')) {
                res.status(400).json({
                    message: `Insufficient balance to start trading bot`,
                    error: error.message
                });
            } else if (error.message?.includes('Account')) {
                res.status(503).json({
                    message: `Binance account service unavailable`,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    message: `Failed to start bot`,
                    error: error.message || 'Unknown error occurred'
                });
            }
        }
    }

    stopBot = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const bot = await this.tradingBotService.getBot(id);

            if (!bot) {
                res.status(404).json({ message: `Bot not found` });
                return;
            }

            await this.tradingBotService.stopBot(bot);
            res.status(200).json({ message: `Binance trading bot stopped for ${bot.symbol}` });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
                return;
            }

            console.error(`Failed to stop bot:`, error);

            if (error.message?.includes('Trading')) {
                res.status(400).json({
                    message: `Error during bot shutdown`,
                    error: error.message
                });
            } else {
                res.status(500).json({
                    message: `Failed to stop bot`,
                    error: error.message || 'Unknown error occurred'
                });
            }
        }
    }


    getBot = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = req.params.id;

            const bot = await this.tradingBotService.getBot(id);

            res.status(200).json(bot);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
                return;
            }

            console.error(`Failed to get bot status:`, error);
            res.status(500).json({
                message: `Failed to retrieve bot status`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    getBots = async (req: Request, res: Response): Promise<void> => {
        try {
            const bots = await this.tradingBotService.getBots();
            res.status(200).json(bots);
        } catch (error: any) {
            console.error(`Failed to get bots:`, error);
            res.status(500).json({
                message: `Failed to retrieve bots`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    updateBot = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const validatedData = validateRequest(BotFormDataSchema, req.body);
            if (!id) {
                res.status(400).json({ message: `Bot ID is required` });
                return;
            }

            const bot = this.tradingBotService.updateBot(id, validatedData);
            res.status(200).json(bot);
        } catch (error: any) {
            console.error(`Failed to update bot:`, error);
            res.status(500).json({
                message: `Failed to update bot`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    deleteBot = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            this.tradingBotService.deleteBot(id);
            res.status(200).json({ message: `Bot deleted` });
        } catch (error: any) {
            console.error(`Failed to delete bot:`, error);
            res.status(500).json({
                message: `Failed to delete bot`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    startAllBots = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.tradingBotService.startAllBots();
            res.status(200).json({ message: `All bots started` });
        } catch (error: any) {
            console.error(`Failed to start all bots:`, error);
            res.status(500).json({
                message: `Failed to start all bots`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    stopAllBots = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.tradingBotService.stopAllBots();
            res.status(200).json({ message: `All bots stopped` });
        } catch (error: any) {
            console.error(`Failed to stop all bots:`, error);
            res.status(500).json({
                message: `Failed to stop all bots`,
                error: error.message || 'Unknown error occurred'
            });
        }
    }

    cancelOrder = async (req: Request, res: Response) => {
        try {
            const { symbol } = validateRequest(SymbolParamSchema, req.params);

            const orders = await this.binanceTradesService.closePosition(symbol);
            logger.success(`Cancelled order for ${symbol}`);
            res.status(200).json({
                message: 'Order cancelled',
                orders: orders
            });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                handleValidationError(error, res);
                return;
            }

            res.status(500).json({
                message: 'Failed to cancel order',
                error: error.message
            });
        }
    }
}