import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { usersRouter } from './modules/users/users.routes';
import botsRouter from './modules/bots/bots.routes';
import botSubscriptionsRouter from './modules/bot-subscriptions/bot-subscriptions.routes';
import { logger } from './shared/utils/logger';
import { tradingviewRouter } from './webhooks/tradingview/tradingview.routes';
import { botService } from './modules/bots/bots.service';
import prisma from './core/prisma/prisma-client';
import { accountRouter } from './modules/account/account.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/account', accountRouter);
app.use('/api/bots', botsRouter);
app.use('/api/bot/subscriptions', botSubscriptionsRouter);
app.use('/api/webhooks', tradingviewRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const shutdown = async (signal: string) => {
    logger.debug(`Received ${signal}, shutting down gracefully...`);
    try {
        await botService.stopAllBots();
    } catch (error: any) {
        logger.error("Could not stop all bots", error?.message);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.once("SIGUSR2", async () => {
    await shutdown("SIGUSR2");
    process.kill(process.pid, "SIGUSR2");
});
process.on("uncaughtException", async (err) => {
    logger.error("Uncaught exception:", err);
    await shutdown("uncaughtException");
});
process.on("unhandledRejection", async (err) => {
    logger.error("Unhandled rejection:", err);
    await shutdown("unhandledRejection");
});

app.listen(PORT, async () => {
    logger.debug(`Server running on port ${PORT}`);

    try {
        await prisma.$connect();
        await botService.startAllBots();
        logger.debug('All bots started successfully');
    } catch (error: any) {
        logger.error('Failed to start all bots:', error?.message);
    }
});