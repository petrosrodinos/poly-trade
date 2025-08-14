import { Router } from 'express';
import { BotsController } from './bots.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const botsController = new BotsController();

router.post('/', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.createBot);

router.get('/', authMiddleware.authenticate, authMiddleware.requireUser, botsController.getAllBots);

router.get('/:uuid', authMiddleware.authenticate, authMiddleware.requireUser, botsController.getBotByUuid);

router.put('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.updateBot);

router.delete('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.deleteBot);

router.get('/:uuid/user/subscription', authMiddleware.authenticate, authMiddleware.requireUser, botsController.getBotSubscriptionForUser);


export default router;
