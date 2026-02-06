import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { COOKIE_NAME } from '../utils/constants';

const registerSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6)
});

const loginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6)
});

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 天，与 JWT 过期时间一致
  };
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = registerSchema.parse(req.body);
      const response = await authService.register(payload);
      res.cookie(COOKIE_NAME, response.token, cookieOptions());
      res.json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = loginSchema.parse(req.body);
      const response = await authService.login(payload);
      res.cookie(COOKIE_NAME, response.token, cookieOptions());
      res.json({ success: true, data: response });
    } catch (error) {
      next(error);
    }
  },
  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie(COOKIE_NAME, cookieOptions());
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  }
};
