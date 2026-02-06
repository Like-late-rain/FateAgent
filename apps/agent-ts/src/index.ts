import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

// 中间件
app.use(cors());
app.use(express.json());

// 启动日志
console.log('[Agent-TS] Starting...');
console.log(`[Agent-TS] OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'configured' : 'NOT configured'}`);
console.log(`[Agent-TS] API_FOOTBALL_KEY: ${process.env.API_FOOTBALL_KEY ? 'configured' : 'NOT configured'}`);

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API 路由
app.use('/api/v1', apiRouter);

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 错误处理
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Agent-TS] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`[Agent-TS] Server running on http://localhost:${PORT}`);
});
