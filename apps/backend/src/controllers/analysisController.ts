import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { analysisService } from '../services/analysisService';
import type { AuthenticatedRequest } from '../types/request';

const analysisSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  competition: z.string().min(1),
  matchDate: z.string().min(8)
});

export const analysisController = {
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
      const payload = analysisSchema.parse(req.body);
      const record = await analysisService.createAnalysis(userId, payload);
      res.json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  },
  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: '未登录' }
        });
        return;
      }
      const record = await analysisService.getAnalysis(userId, req.params.id);
      res.json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  },
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: '未登录' }
        });
        return;
      }
      const page = Number(req.query.page ?? 1);
      const pageSize = Number(req.query.pageSize ?? 10);
      const result = await analysisService.listAnalysis(userId, page, pageSize);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};
