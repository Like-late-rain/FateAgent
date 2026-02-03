import { Router } from 'express';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const apiRouter = Router();

apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);
apiRouter.post('/auth/logout', authController.logout);

apiRouter.get('/users/me', authMiddleware, userController.me);
apiRouter.get('/users/me/credits', authMiddleware, userController.credits);
