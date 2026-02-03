import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/request';
import { userService } from '../services/userService';

export const userController = {
  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: '未登录' }
        });
        return;
      }
      const user = await userService.getUserInfo(userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
  async credits(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: '未登录' }
        });
        return;
      }
      const credits = await userService.getCredits(userId);
      res.json({ success: true, data: credits });
    } catch (error) {
      next(error);
    }
  }
};
