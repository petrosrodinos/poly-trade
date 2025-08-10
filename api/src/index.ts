import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { usersRouter } from './modules/users/users.routes';
import { alpacaRouter } from './modules/trades/alpaca/alpaca.routes';
import { binanceRouter } from './modules/trades/binance/binance.routes';
import { logger } from './shared/utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/alpaca', alpacaRouter);
app.use('/api/binance', binanceRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const shutdown = async (signal: string) => {
    logger.debug(`Received ${signal}, shutting down gracefully...`);
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

app.listen(PORT, () => {
    logger.debug(`Server running on port ${PORT}`);
});