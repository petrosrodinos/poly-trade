import { Router } from 'express';
import { AccountController } from './account.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

const accountController = new AccountController();

router.get('/status', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getAccount);
router.get('/trades', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getFuturesUserTrades);
router.get('/info', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getAccountFutures);
// router.get('/income', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getFuturesIncome);
router.get('/income/chart', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getAccountIncomeChart);
router.get('/ping', authMiddleware.authenticate, authMiddleware.requireUser, accountController.ping);

router.get('/position', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getPosition);
router.post('/position', authMiddleware.authenticate, authMiddleware.requireUser, accountController.openPosition);
router.post('/position/close', authMiddleware.authenticate, authMiddleware.requireUser, accountController.closePosition);

export { router as accountRouter };