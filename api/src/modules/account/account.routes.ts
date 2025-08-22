import { Router } from 'express';
import { AccountController } from './account.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

const accountController = new AccountController();

router.get('/status', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getAccount);
router.get('/trades', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getFuturesUserTrades);
router.get('/info', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getAccountFutures);
router.get('/income', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getFuturesIncome);
router.get('/income/chart', authMiddleware.authenticate, authMiddleware.requireUser, accountController.getAccountIncomeChart);
router.get('/ping', authMiddleware.authenticate, authMiddleware.requireUser, accountController.ping);

export { router as accountRouter };