import { Router } from 'express';
import { UsersController } from './controllers/users.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { AuthController } from './controllers/auth.controller';

const router = Router();
const usersController = new UsersController();
const authController = new AuthController();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/change-password', authMiddleware.authenticate, authController.changePassword);

router.get('/me', authMiddleware.authenticate, usersController.getMe);
router.get('/', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.getUsers);

router.put('/', authMiddleware.authenticate, usersController.updateUser);
router.put('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.updateUserAdmin);

router.delete('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.deleteUser);
router.delete('/', authMiddleware.authenticate, authMiddleware.requireAdmin, usersController.deleteAllUsers);



export { router as usersRouter }; 