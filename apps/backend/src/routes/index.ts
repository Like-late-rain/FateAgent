import { Router } from 'express';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { orderController } from '../controllers/orderController';
import { analysisController } from '../controllers/analysisController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { paymentCallbackAuth } from '../middlewares/paymentCallbackAuth';

export const apiRouter = Router();

apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);
apiRouter.post('/auth/logout', authController.logout);

apiRouter.get('/users/me', authMiddleware, userController.me);
apiRouter.get('/users/me/credits', authMiddleware, userController.credits);

apiRouter.post('/orders', authMiddleware, orderController.create);
apiRouter.post('/orders/callback', paymentCallbackAuth, orderController.callback);

apiRouter.post('/analysis', authMiddleware, analysisController.create);
apiRouter.get('/analysis/:id', authMiddleware, analysisController.getById);
apiRouter.get('/analysis', authMiddleware, analysisController.list);
