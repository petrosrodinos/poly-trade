import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.get('/stats', authMiddleware.authenticate, authMiddleware.requireAdmin, adminController.getAdminStats);

export { router as adminRouter };
