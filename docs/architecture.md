# 架构说明

## 系统总览
```mermaid
flowchart LR
  User[User/Browser] --> Web[Web (Next.js)]
  Web --> Backend[Backend (Express API)]
  Backend --> DB[(Supabase Postgres)]
  Backend --> Agent[Agent (FastAPI)]
  Agent --> OpenAI[OpenAI API]
  Backend --> WeChat[WeChat Pay]
```

## 服务组件
- Web (Next.js): 负责页面渲染、表单输入与调用 Backend API。
- Backend (Express): 处理认证、订单与分析任务编排，读写 Supabase Postgres。
- Agent (FastAPI): 执行赛事分析，调用 OpenAI SDK 生成结果或返回 mock。

## 数据流
1. User 在 Web 提交比赛信息，调用 Backend `/api/analysis`。
2. Backend 校验请求与用户次数，写入 `analysis_records` 并标记为 `processing`。
3. Backend 调用 Agent `/api/v1/analyze`（可选 `X-API-KEY`）。
4. Agent 调用 OpenAI API（如未配置 key 则走 mock）返回分析结果。
5. Backend 更新 `analysis_records`，扣减次数并返回结果给 Web。

## 数据库结构
- `users`: 用户账户、手机号、剩余次数。
- `credit_transactions`: 次数变更流水，关联 `users`。
- `orders`: 购买订单与支付状态，关联 `users`。
- `analysis_records`: 分析请求与结果，关联 `users`。

## API 集成点
- Web <-> Backend REST API：`/api/auth`, `/api/users`, `/api/analysis`, `/api/orders`。
- Backend -> Agent：`/api/v1/analyze`。
- Backend -> Supabase Postgres：使用 `SUPABASE_SERVICE_KEY` 访问。
- Backend -> WeChat Pay：支付回调校验与订单更新（可选）。
- Agent -> OpenAI API：生成分析结果。

## 安全性考虑
- JWT 放入 httpOnly Cookie，`NODE_ENV=production` 时启用 `secure`。
- CORS 限制为 `FRONTEND_URL`，并允许 `credentials`。
- Agent 支持 `X-API-KEY` 作为请求鉴权。
- `SUPABASE_SERVICE_KEY` 等敏感配置仅在 server-side 使用。
- 输入校验采用 Zod 与 Pydantic，减少非法请求。
