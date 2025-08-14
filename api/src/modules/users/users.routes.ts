import { Router } from 'express';
import { UsersController } from './users.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const usersController = new UsersController();

router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.delete('/', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.deleteAllUsers);
router.delete('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.deleteUser);



export { router as usersRouter }; 