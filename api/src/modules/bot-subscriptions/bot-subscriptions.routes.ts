import { Router } from 'express';
import { BotSubscriptionsController } from './bot-subscriptions.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const botSubscriptionsController = new BotSubscriptionsController();

router.post('/', authMiddleware.authenticate, authMiddleware.requireUser, botSubscriptionsController.createBotSubscription);

router.get('/', authMiddleware.authenticate, authMiddleware.requireUser, botSubscriptionsController.getAllBotSubscriptions);

router.put('/:uuid', authMiddleware.authenticate, authMiddleware.requireUser, botSubscriptionsController.updateBotSubscription);

router.delete('/:uuid', authMiddleware.authenticate, authMiddleware.requireUser, botSubscriptionsController.deleteBotSubscription);

router.get('/bot/:bot_uuid', authMiddleware.authenticate, authMiddleware.requireUser, botSubscriptionsController.getBotSubscriptionByBotUuid);

export default router;
