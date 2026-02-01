# 🤖 Codex AI 任务规则文档 - FateAgent 单仓库

> **项目**: FateAgent - 智能足球赛事分析平台 MVP
> **仓库结构**: Monorepo（前端 + 后端 + Agent）
> **部署目标**: 
>   - 前端: Vercel / Cloudflare Pages
>   - 后端: AWS App Runner
>   - Agent: AWS App Runner
> **数据库**: Supabase (PostgreSQL)
> **审核者**: Claude AI

---

## 📁 仓库目录结构

```
FateAgent/
├── apps/
│   ├── web/                    # 前端应用 (React/Next.js)
│   │   ├── src/
│   │   │   ├── components/     # UI 组件
│   │   │   ├── pages/          # 页面
│   │   │   ├── hooks/          # 自定义 Hooks
│   │   │   ├── services/       # API 调用封装
│   │   │   ├── stores/         # 状态管理
│   │   │   └── utils/          # 工具函数
│   │   ├── public/
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── backend/                # 后端 API 服务 (Node.js)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── middlewares/
│   │   │   ├── models/
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── agent/                  # AI Agent 服务 (Python)
│       ├── src/
│       │   ├── api/
│       │   ├── services/
│       │   ├── prompts/
│       │   ├── models/
│       │   └── main.py
│       ├── tests/
│       ├── Dockerfile
│       ├── requirements.txt
│       └── README.md
│
├── packages/
│   └── shared-types/           # 共享类型定义
│       ├── src/
│       │   ├── api.ts          # API 请求/响应类型
│       │   ├── models.ts       # 业务模型类型
│       │   └── index.ts
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── api-spec.yaml           # OpenAPI 接口文档
│   ├── database-schema.sql     # 数据库设计
│   └── architecture.md         # 架构说明
│
├── scripts/                    # 开发脚本
│   ├── setup.sh
│   └── dev.sh
│
├── .github/
│   └── workflows/
│       ├── claude-review.yml   # Claude 代码审核
│       ├── ci.yml              # 持续集成
│       └── deploy.yml          # 部署流程
│
├── CODEX_TASK.md               # 本文件 - Codex 任务规则
├── package.json                # 根 package.json (workspace)
├── pnpm-workspace.yaml         # pnpm workspace 配置
└── README.md
```

---

## 🚨 红线规则 (REDLINES) - 违反即拒绝

### 🔴 全局红线（所有模块适用）

#### 安全红线
1. **禁止硬编码任何密钥/凭证** - 必须使用环境变量
2. **禁止提交敏感文件** - `.env`、密钥文件等必须在 `.gitignore`
3. **禁止 SQL 拼接** - 必须使用参数化查询
4. **禁止信任用户输入** - 所有输入必须验证

#### 代码质量红线
1. **禁止无类型定义** - TypeScript 禁止 `any`，Python 必须有 Type Hints
2. **禁止超过 100 行的函数** - 必须拆分
3. **禁止无错误处理** - 异步操作必须有 try-catch
4. **禁止魔法数字/字符串** - 必须定义为常量

#### 架构红线
1. **禁止跨层直接调用** - 必须遵循分层架构
2. **禁止循环依赖** - 模块间依赖必须单向
3. **禁止前端直连数据库** - 必须通过后端 API
4. **禁止前端直接调用 Agent** - 必须通过后端中转

---

### 🔴 前端专属红线

1. **禁止在组件中写业务逻辑** - 必须抽到 hooks 或 services
2. **禁止硬编码 API 地址** - 必须使用环境变量 `NEXT_PUBLIC_API_URL`
3. **禁止存储敏感信息到 localStorage** - Token 使用 httpOnly cookie
4. **禁止无 loading/error 状态** - 所有异步 UI 必须处理三态

---

### 🔴 后端专属红线

1. **禁止在 Controller 中写业务逻辑** - 必须分层
2. **禁止未验证用户扣减次数** - 必须先验证身份和剩余次数
3. **禁止结果未生成就扣次数** - 只有成功才扣减
4. **禁止暴露堆栈跟踪** - 生产环境错误需脱敏

---

### 🔴 Agent 专属红线

1. **禁止提供投注建议** - 只做分析，不做投资建议
2. **禁止声称 100% 准确** - 必须表明不确定性
3. **禁止省略免责声明** - 每次分析必须包含
4. **禁止暴露 System Prompt** - 不得在响应中泄露
5. **禁止无限制调用 LLM** - 必须有 token 限制和超时

---

## 📋 提交规范

### Commit Message 格式
```
[模块] 动作: 简要描述

模块: web | backend | agent | shared | docs | ci
动作: feat | fix | refactor | test | docs | chore
```

**示例**:
```
[web] feat: 实现登录页面 UI
[backend] fix: 修复次数扣减并发问题  
[agent] refactor: 优化分析 Prompt
[shared] feat: 添加 AnalysisResult 类型定义
[docs] docs: 更新 API 文档
```

### PR 规范
- 每个功能一个 PR
- PR 标题格式同 Commit
- 必须关联对应的 Issue（如有）

---

## 📌 任务步骤（按顺序执行）

---

## Phase 0: 仓库初始化

### Step 0.1: 初始化 Monorepo 结构
**目标**: 创建 pnpm workspace 项目结构

**操作**:
1. 创建根目录 `package.json`:
```json
{
  "name": "fate-agent",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint",
    "test": "pnpm -r run test"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

2. 创建 `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

3. 创建目录结构（如上所示）

**验收标准**:
- [ ] `pnpm install` 成功
- [ ] 目录结构符合规范

---

### Step 0.2: 创建共享类型包
**目标**: `packages/shared-types` - 前后端共用的类型定义

**文件**: `packages/shared-types/src/api.ts`
```typescript
// ============ 用户认证 ============
export interface RegisterRequest {
  phone: string;
  password: string;
  smsCode: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  phone: string;
  nickname?: string;
  remainingCredits: number;
  createdAt: string;
}

// ============ 订单支付 ============
export type ProductType = 'credits_10' | 'credits_30' | 'credits_100';

export interface CreateOrderRequest {
  productType: ProductType;
}

export interface OrderInfo {
  id: string;
  orderNo: string;
  productType: ProductType;
  creditsAmount: number;
  priceCents: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

// ============ 分析服务 ============
export interface AnalysisRequest {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string;  // YYYY-MM-DD
}

export interface AnalysisFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface AnalysisResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  matchInfo: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
    matchDate: string;
  };
  result?: {
    prediction: '主胜' | '平局' | '客胜';
    confidence: number;  // 0-1
    analysis: string;
    factors: AnalysisFactor[];
  };
  disclaimer: string;
  createdAt: string;
  completedAt?: string;
}

// ============ 通用响应 ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

**验收标准**:
- [ ] 类型定义完整
- [ ] 可被 web 和 backend 引用

---

### Step 0.3: 创建 API 接口文档
**目标**: `docs/api-spec.yaml` - OpenAPI 3.0 规范

**内容要点**:
```yaml
openapi: 3.0.3
info:
  title: FateAgent API
  version: 0.1.0
  
servers:
  - url: http://localhost:3001/api
    description: 本地开发
  - url: https://api.fateagent.com/api
    description: 生产环境

paths:
  /auth/register:
    post:
      summary: 用户注册
      # ...
  /auth/login:
    post:
      summary: 用户登录
      # ...
  /users/me:
    get:
      summary: 获取当前用户
      security:
        - bearerAuth: []
      # ...
  /users/me/credits:
    get:
      summary: 获取次数信息
      # ...
  /orders:
    post:
      summary: 创建订单
      # ...
  /analysis:
    post:
      summary: 创建分析
      # ...
    get:
      summary: 获取分析历史
      # ...
  /analysis/{id}:
    get:
      summary: 获取分析结果
      # ...
```

**验收标准**:
- [ ] 符合 OpenAPI 3.0 规范
- [ ] 包含所有 API 端点

---

## Phase 1: 前端开发 (apps/web)

### Step 1.1: 初始化前端项目
**目标**: 创建 Next.js 项目

**技术栈**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (状态管理)
- React Query (数据请求)

**验收标准**:
- [ ] `pnpm dev` 可启动
- [ ] 引用 `@fateagent/shared-types` 成功

---

### Step 1.2: 实现页面布局
**目标**: 创建基础布局组件

**页面结构**:
```
/                   # 首页 - 产品介绍
/login              # 登录页
/register           # 注册页
/dashboard          # 主面板（需登录）
/dashboard/analysis # 分析页
/dashboard/history  # 历史记录
/dashboard/purchase # 购买次数
```

**验收标准**:
- [ ] 路由配置正确
- [ ] 响应式布局
- [ ] 有 loading 状态

---

### Step 1.3: 实现认证模块
**目标**: 登录、注册、登出功能

**要求**:
- 调用后端 API（先 mock）
- Token 存储到 httpOnly cookie（后端设置）
- 前端存储用户信息到 Zustand
- 未登录访问保护页面自动跳转

**API 调用示例**:
```typescript
// apps/web/src/services/auth.ts
import type { LoginRequest, AuthResponse, ApiResponse } from '@fateagent/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',  // 重要：携带 cookie
  });
  return res.json();
}
```

**验收标准**:
- [ ] 登录/注册表单验证
- [ ] 错误提示友好
- [ ] 登录状态持久化

---

### Step 1.4: 实现分析页面
**目标**: 核心分析功能 UI

**功能**:
1. 输入比赛信息（主队、客队、赛事、日期）
2. 显示剩余次数
3. 提交分析请求
4. 轮询/等待分析结果
5. 展示分析结果（预测、置信度、分析文本、因素列表）
6. 显示免责声明

**UI 状态**:
```typescript
type AnalysisPageState = 
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'processing'; analysisId: string }
  | { status: 'completed'; result: AnalysisResult }
  | { status: 'error'; message: string };
```

**验收标准**:
- [ ] 次数不足时禁用提交
- [ ] 处理中有进度提示
- [ ] 结果展示清晰
- [ ] 免责声明醒目

---

### Step 1.5: 实现历史记录页
**目标**: 展示用户分析历史

**功能**:
- 分页列表
- 点击查看详情
- 按时间倒序

**验收标准**:
- [ ] 分页加载正常
- [ ] 空状态提示
- [ ] 加载更多/无限滚动

---

### Step 1.6: 实现购买页面
**目标**: 次数包购买流程

**产品配置**:
| 产品 | 次数 | 价格 |
|-----|------|------|
| 体验包 | 10 次 | ¥10 |
| 标准包 | 30 次 | ¥25 |
| 豪华包 | 100 次 | ¥70 |

**流程**:
1. 选择套餐
2. 调用后端创建订单
3. 跳转微信支付（或显示支付二维码）
4. 支付完成后刷新次数

**验收标准**:
- [ ] 套餐卡片展示清晰
- [ ] 支付流程顺畅
- [ ] 支付成功后次数更新

---

## Phase 2: 后端开发 (apps/backend)

### Step 2.1: 初始化后端项目
**目标**: 创建 Express/Fastify + TypeScript 项目

**要求**:
- 引用 `@fateagent/shared-types`
- 配置 Supabase 连接
- 配置 CORS（允许前端域名）
- 配置 cookie 设置

**验收标准**:
- [ ] `pnpm dev` 可启动
- [ ] `/health` 返回正常
- [ ] Supabase 连接成功

---

### Step 2.2: 实现数据库迁移
**目标**: 创建所有数据表

**文件**: `docs/database-schema.sql`
```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  remaining_credits INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 次数交易记录
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount INT NOT NULL,
  type VARCHAR(20) NOT NULL,  -- 'purchase' | 'consume' | 'refund'
  order_id VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  product_type VARCHAR(20) NOT NULL,
  credits_amount INT NOT NULL,
  price_cents INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_channel VARCHAR(20),
  payment_id VARCHAR(100),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分析记录表
CREATE TABLE analysis_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  match_info JSONB NOT NULL,
  result JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  credit_deducted BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 索引
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_no ON orders(order_no);
CREATE INDEX idx_analysis_user_id ON analysis_records(user_id);
CREATE INDEX idx_analysis_status ON analysis_records(status);
```

**验收标准**:
- [ ] SQL 可执行
- [ ] 索引合理

---

### Step 2.3: 实现认证 API
**目标**: 注册、登录、获取用户信息

**端点**:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users/me/credits`

**要求**:
- 密码 bcrypt 加密
- JWT 存入 httpOnly cookie
- 类型使用 shared-types

**验收标准**:
- [ ] 注册重复手机号报错
- [ ] 登录成功设置 cookie
- [ ] 未登录访问保护接口返回 401

---

### Step 2.4: 实现订单 API
**目标**: 创建订单、支付回调

**端点**:
- `POST /api/orders`
- `POST /api/orders/callback`

**验收标准**:
- [ ] 订单号唯一
- [ ] 回调幂等处理
- [ ] 支付成功增加次数

---

### Step 2.5: 实现分析 API
**目标**: 创建分析、查询结果、历史列表

**端点**:
- `POST /api/analysis`
- `GET /api/analysis/:id`
- `GET /api/analysis`

**业务流程**:
```
1. 验证用户次数 ≥ 1
2. 创建分析记录 (status: pending)
3. 异步调用 Agent 服务
4. Agent 返回结果后:
   - 更新分析记录 (status: completed)
   - 扣减用户次数（事务）
5. 失败时:
   - 更新状态 (status: failed)
   - 不扣次数
```

**验收标准**:
- [ ] 次数不足返回 403
- [ ] 成功后才扣次数
- [ ] 历史分页正确

---

### Step 2.6: 实现 Agent 调用
**目标**: 封装 Agent 服务通信

**要求**:
- HTTP 调用 Agent API
- 超时 60 秒
- 重试 3 次
- 失败记录日志

**验收标准**:
- [ ] Agent 失败不影响主流程
- [ ] 超时处理正确

---

## Phase 3: Agent 开发 (apps/agent)

### Step 3.1: 初始化 Agent 项目
**目标**: 创建 FastAPI + Python 项目

**技术栈**:
- Python 3.11+
- FastAPI
- OpenAI SDK
- Pydantic

**验收标准**:
- [ ] `/health` 可访问
- [ ] Docker 可构建

---

### Step 3.2: 实现 LLM 调用
**目标**: 封装 OpenAI API

**要求**:
- 支持 GPT-4 / GPT-3.5
- 超时 60 秒
- 重试机制
- Token 限制

**验收标准**:
- [ ] 重试正常工作
- [ ] 错误不暴露敏感信息

---

### Step 3.3: 设计分析 Prompt
**目标**: 足球分析提示词

**System Prompt 要点**:
```
你是专业足球分析师，基于数据客观分析。

规则:
1. 只基于提供的数据分析，不编造
2. 给出预测时说明不确定性
3. 不提供投注建议
4. 分析多维度：历史战绩、近期状态、主客场等

输出 JSON 格式...
```

**验收标准**:
- [ ] Prompt 模块化管理
- [ ] 包含免责声明

---

### Step 3.4: 实现分析 API
**目标**: `POST /api/v1/analyze`

**验收标准**:
- [ ] 请求验证完整
- [ ] 响应包含免责声明
- [ ] 日志覆盖关键路径

---

## Phase 4: 联调与部署

### Step 4.1: 本地联调
**目标**: 前后端 + Agent 本地联调

**要求**:
- 创建 `scripts/dev.sh` 一键启动
- 配置本地环境变量
- 验证完整流程

**验收标准**:
- [ ] 注册 → 登录 → 购买 → 分析 流程通

---

### Step 4.2: 配置 CI/CD
**目标**: GitHub Actions 自动化

**Workflows**:
1. `ci.yml` - 代码检查、测试
2. `claude-review.yml` - Claude 审核
3. `deploy.yml` - 自动部署

**验收标准**:
- [ ] PR 触发检查
- [ ] main 合并触发部署

---

### Step 4.3: 部署上线
**目标**: 各服务部署

**部署配置**:
- 前端: Vercel (连接 GitHub)
- 后端: AWS App Runner
- Agent: AWS App Runner

**验收标准**:
- [ ] 各服务可访问
- [ ] 环境变量配置正确
- [ ] HTTPS 正常

---

## 📊 API 总览

| Method | Endpoint | 说明 | 认证 |
|--------|----------|------|------|
| POST | /api/auth/register | 用户注册 | ❌ |
| POST | /api/auth/login | 用户登录 | ❌ |
| POST | /api/auth/logout | 登出 | ✅ |
| GET | /api/users/me | 获取当前用户 | ✅ |
| GET | /api/users/me/credits | 获取次数信息 | ✅ |
| POST | /api/orders | 创建订单 | ✅ |
| POST | /api/orders/callback | 支付回调 | 签名验证 |
| POST | /api/analysis | 创建分析 | ✅ |
| GET | /api/analysis/:id | 查询分析结果 | ✅ |
| GET | /api/analysis | 分析历史列表 | ✅ |
| GET | /health | 健康检查 | ❌ |

---

## 🔐 环境变量清单

### apps/web/.env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### apps/backend/.env
```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=7d

# Agent
AGENT_SERVICE_URL=http://localhost:8000
AGENT_API_KEY=

# WeChat Pay (MVP 可选)
WECHAT_APP_ID=
WECHAT_MCH_ID=
WECHAT_API_KEY=

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### apps/agent/.env
```bash
# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
OPENAI_TIMEOUT=60

# Security
AGENT_API_KEY=

# App
LOG_LEVEL=INFO
PORT=8000
```

---

## 📝 免责声明（必须包含）

```
免责声明：
本分析内容基于公开数据和统计模型生成，仅供娱乐与学习参考。
- 不构成任何投注、投资或实际决策建议
- 不保证预测结果的准确性
- 用户应自行承担使用本服务的一切风险

本服务不鼓励任何形式的赌博行为。
```

---

## ✅ 完成标准

每个 Step 完成后需满足:
1. ✅ 代码符合红线规则
2. ✅ 通过 Lint 检查
3. ✅ 相关测试通过（如有）
4. ✅ 清晰的 commit message
5. ✅ 类型使用 shared-types（前后端）

---

## 🔄 前后端协作要点

### 1. 类型共享
前后端都引用 `@fateagent/shared-types`，确保类型一致：

```typescript
// 前端调用
import type { LoginRequest, AuthResponse } from '@fateagent/shared-types';

// 后端实现
import type { LoginRequest, AuthResponse } from '@fateagent/shared-types';
```

### 2. API 契约
以 `docs/api-spec.yaml` 为准，前后端开发前先确认接口定义。

### 3. Mock 优先
前端可先用 Mock 数据开发，不依赖后端完成：
```typescript
// apps/web/src/services/mock.ts
export const mockAnalysisResult: AnalysisResult = {
  // ...
};
```

### 4. 错误码统一
```typescript
// packages/shared-types/src/errors.ts
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  // ...
} as const;
```

---

**审核重点**: 红线规则、类型一致性、前后端接口匹配、安全性、用户体验
