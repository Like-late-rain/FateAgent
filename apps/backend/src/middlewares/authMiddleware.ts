import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { COOKIE_NAME } from '../utils/constants';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '未登录' }
    });
    return;
  }
  try {
    const userId = authService.verifyToken(token);
    req.userId = userId;
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '登录已过期' }
    });
  }
}
