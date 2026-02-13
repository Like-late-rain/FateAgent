import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { parseMatchQuery } from '../services/parseService.js';
import { analyzeMatch, getDisclaimer } from '../services/analysisService.js';
import { fetchMatchResult } from '../services/matchResultService.js';

const router = express.Router();

// Schema 定义
const parseSchema = z.object({
  query: z.string().min(1)
});

const analyzeSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  competition: z.string().min(1),
  matchDate: z.string().min(8)
});

const matchResultSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  matchDate: z.string().min(8) // YYYY-MM-DD
});

// API Key 验证中间件
function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const configuredKey = (process.env.AGENT_API_KEY || '').trim();
  const isProduction = process.env.NODE_ENV === 'production';

  // 生产环境必须配置 API Key
  if (isProduction && !configuredKey) {
    console.error('[Auth] API key not configured in production');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // 开发环境如果没有配置 API Key，则跳过验证
  if (!configuredKey) {
    return next();
  }

  const providedKey = (req.header('X-API-KEY') || '').trim();
  if (providedKey !== configuredKey) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  next();
}

// 解析接口
router.post('/parse', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { query } = parseSchema.parse(req.body);
    const result = await parseMatchQuery(query);
    res.json(result);
  } catch (error) {
    console.error('[Route /parse] Error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: '请求参数无效' });
      return;
    }
    res.status(500).json({ success: false, error: '解析服务内部错误' });
  }
});

// 分析接口
router.post('/analyze', requireApiKey, async (req: Request, res: Response) => {
  try {
    const payload = analyzeSchema.parse(req.body);
    const result = await analyzeMatch(payload);
    res.json(result);
  } catch (error) {
    console.error('[Route /analyze] Error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: '请求参数无效' });
      return;
    }
    res.status(500).json({
      result: {
        prediction: '平局',
        confidence: 0.5,
        analysis: '分析服务暂时不可用',
        factors: []
      },
      disclaimer: getDisclaimer()
    });
  }
});

// 查询比赛结果接口
router.post('/match-result', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { homeTeam, awayTeam, matchDate } = matchResultSchema.parse(req.body);
    console.log(`[Route /match-result] Fetching result for ${homeTeam} vs ${awayTeam} on ${matchDate}`);

    const result = await fetchMatchResult(homeTeam, awayTeam, matchDate);
    res.json(result);
  } catch (error) {
    console.error('[Route /match-result] Error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: '请求参数无效' });
      return;
    }
    res.status(500).json({ success: false, error: '查询服务内部错误' });
  }
});

export default router;
