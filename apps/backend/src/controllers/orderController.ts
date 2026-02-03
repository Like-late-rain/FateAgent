import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { orderService } from '../services/orderService';
import type { AuthenticatedRequest } from '../types/request';

const createOrderSchema = z.object({
  productType: z.enum(['credits_10', 'credits_30', 'credits_100'])
});

const callbackSchema = z.object({
  orderNo: z.string().min(4)
});

export const orderController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: '未登录' }
        });
        return;
      }
      const payload = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder(userId, payload);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  },
  async callback(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const payload = callbackSchema.parse(req.body);
      const order = await orderService.handlePaymentCallback(payload.orderNo);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
};
