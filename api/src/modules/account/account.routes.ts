import { Router } from 'express';
import { AccountController } from './account.controller';

const router = Router();

const accountController = new AccountController();

router.get('/status', accountController.getAccount);
router.get('/trades', accountController.getFuturesUserTrades);
router.get('/info', accountController.getAccountFutures);
router.get('/income', accountController.getFuturesIncome);
router.get('/income/chart', accountController.getAccountIncomeChart);
router.get('/ping', accountController.ping);

export { router as accountRouter };