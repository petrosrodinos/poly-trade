import { Router } from 'express';
import { UsersController } from './controllers/users.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { AuthController } from './controllers/auth.controller';

const router = Router();
const usersController = new UsersController();
const authController = new AuthController();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/me', authMiddleware.authenticate, usersController.getMe);
router.get('/', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.getUsers);
router.put('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.updateUser);

router.delete('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.deleteUser);
router.delete('/', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.deleteAllUsers);



export { router as usersRouter }; 