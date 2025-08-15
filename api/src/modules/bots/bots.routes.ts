import { Router } from 'express';
import { BotsController } from './bots.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const botsController = new BotsController();

router.post('/', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.createBot);

router.get('/', authMiddleware.authenticate, authMiddleware.requireUser, botsController.getAllBots);

router.get('/internal', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.getInternalBots);

router.get('/:uuid', authMiddleware.authenticate, authMiddleware.requireUser, botsController.getBotByUuid);

router.delete('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.deleteBot);

router.put('/start-all', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.startAllBots);

router.put('/stop-all', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.stopAllBots);

router.put('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, botsController.updateBot);

router.get('/:uuid/user/subscription', authMiddleware.authenticate, authMiddleware.requireUser, botsController.getBotSubscriptionForUser);



export default router;
