# FateAgent - 智能足球赛事分析平台

## 项目简介
FateAgent 是一个智能足球赛事分析平台，提供 Web UI、Backend API 与 Agent 服务，用于赛事信息输入、分析任务调度与结果展示。

## 技术栈
- pnpm monorepo
- Web: Next.js, React, TypeScript
- Backend: Express, TypeScript, Supabase SDK
- Agent: FastAPI, Uvicorn, Python, OpenAI SDK
- Shared: Zod, Pydantic

## 快速开始
### 前置条件
- Node.js 20+
- pnpm
- Python 3.11+
- Supabase 项目（用于持久化数据）

### 安装依赖
```bash
pnpm install
cd apps/agent && pip install -r requirements.txt
```

### 启动开发服务
1. 配置环境变量
   - Backend: `apps/backend/.env.example` 复制为 `apps/backend/.env` 并补全必需项
   - Web: 创建 `apps/web/.env.local` 并设置 `NEXT_PUBLIC_API_URL`
   - Agent: 设置 `OPENAI_API_KEY`（可选，未设置会返回 mock 结果）
2. 启动服务
```bash
pnpm dev
cd apps/agent && uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## 项目结构
```
apps/
  web/        # Web (Next.js)
  backend/    # Backend (Express)
  agent/      # Agent (FastAPI)
packages/
  shared-types/ # Shared TypeScript types
docs/
  api-spec.yaml
  database-schema.sql
  architecture.md
```

## 环境变量
### Web
- `NEXT_PUBLIC_API_URL` (required): Backend API base URL, e.g. `http://localhost:3001/api`

### Backend
- `PORT` (default: 3001)
- `FRONTEND_URL` (default: http://localhost:3000)
- `NODE_ENV` (optional; production enables secure cookies)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (default: 7d)
- `SUPABASE_URL` (required)
- `SUPABASE_SERVICE_KEY` (required)
- `SUPABASE_ANON_KEY` (optional)
- `AGENT_SERVICE_URL` (default: http://localhost:8000)
- `AGENT_API_KEY` (optional; must match Agent `AGENT_API_KEY`)
- `WECHAT_APP_ID` (optional; required for WeChat Pay)
- `WECHAT_MCH_ID` (optional; required for WeChat Pay)
- `WECHAT_API_KEY` (required for payment callback auth)

### Agent
- `OPENAI_API_KEY` (optional; when unset, returns mock results)
- `OPENAI_MODEL` (default: gpt-4o-mini)
- `OPENAI_MAX_TOKENS` (default: 1200)
- `OPENAI_TIMEOUT` (default: 60)
- `OPENAI_RETRIES` (default: 3)
- `AGENT_API_KEY` (optional; if set, requests must include `X-API-KEY`)

## 许可证
未提供 LICENSE 文件。
