import { Router } from 'express';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { orderController } from '../controllers/orderController';
import { analysisController } from '../controllers/analysisController';
import * as matchResultController from '../controllers/matchResultController.js';
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

apiRouter.post('/analysis/parse', authMiddleware, analysisController.parse);
apiRouter.post('/analysis', authMiddleware, analysisController.create);
apiRouter.get('/analysis/:id', authMiddleware, analysisController.getById);
apiRouter.get('/analysis', authMiddleware, analysisController.list);

// 比赛结果和 Agent 性能
apiRouter.post('/match-results', authMiddleware, matchResultController.recordResult);
apiRouter.post('/match-results/auto-fetch/:id', authMiddleware, matchResultController.autoFetchResult);
apiRouter.get('/match-results/comparison/:id', authMiddleware, matchResultController.getComparison);
apiRouter.get('/agent/performance', matchResultController.getPerformanceMetrics);
