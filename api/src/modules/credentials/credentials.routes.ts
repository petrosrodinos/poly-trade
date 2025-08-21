import { Router } from 'express';
import { CredentialsController } from './credentials.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const credentialsController = new CredentialsController();

router.post('/', authMiddleware.authenticate, authMiddleware.requireUser, credentialsController.createCredentials);

router.get('/user', authMiddleware.authenticate, authMiddleware.requireUser, credentialsController.getUserCredential);

router.get('/', authMiddleware.authenticate, authMiddleware.requireAdmin, credentialsController.getAllCredentials);

router.delete('/', authMiddleware.authenticate, authMiddleware.requireAdmin, credentialsController.deleteAllCredentials);

router.delete('/:uuid', authMiddleware.authenticate, authMiddleware.requireAdmin, credentialsController.deleteCredential);


export default router;
