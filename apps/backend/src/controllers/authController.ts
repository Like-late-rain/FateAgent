import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { COOKIE_NAME } from '../utils/constants';

const registerSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6),
  smsCode: z.string().min(4)
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
    secure: isProd
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
