import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  recordMatchResult,
  getAnalysisComparison,
  getAgentPerformanceMetrics
} from '../services/matchResultService.js';

// 录入比赛结果
export async function recordResult(req: Request, res: Response) {
  try {
    const schema = z.object({
      analysisId: z.string().min(1),
      homeScore: z.number().int().min(0),
      awayScore: z.number().int().min(0)
    });

    const { analysisId, homeScore, awayScore } = schema.parse(req.body);

    const result = await recordMatchResult(analysisId, homeScore, awayScore);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[RecordResult] Error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: '请求参数无效' });
      return;
    }
    res.status(500).json({ error: '录入失败' });
  }
}

// 获取预测对比结果
export async function getComparison(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: '缺少分析ID' });
      return;
    }

    const result = await getAnalysisComparison(id);

    if (!result.success) {
      res.status(400).json({
        error: result.error,
        canCompare: result.canCompare,
        matchDate: result.matchDate
      });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('[GetComparison] Error:', error);
    res.status(500).json({ error: '获取失败' });
  }
}

// 获取 Agent 性能指标
export async function getPerformanceMetrics(req: Request, res: Response) {
  try {
    const result = await getAgentPerformanceMetrics();

    if (!result.success) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('[GetPerformanceMetrics] Error:', error);
    res.status(500).json({ error: '获取失败' });
  }
}
