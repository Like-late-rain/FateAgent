# 设置管理员账号指南

## 概述

本指南介绍如何将账号 17780504161 设置为管理员，使其拥有无限次分析权限。

## 步骤 1: 在 Supabase 中添加 role 字段

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目：`npcnckyrtacgpxpfpnua`
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query** 创建新查询
5. 复制以下 SQL 并执行：

```sql
-- 添加 role 字段到 users 表
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 添加注释
COMMENT ON COLUMN users.role IS '用户角色：user(普通用户) 或 admin(管理员，拥有无限次分析权限)';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 将账号 17780504161 设置为管理员
UPDATE users
SET role = 'admin'
WHERE phone = '17780504161';

-- 验证结果
SELECT phone, nickname, remaining_credits, role
FROM users
WHERE phone = '17780504161';
```

6. 点击 **Run** 执行 SQL
7. 检查结果，确认用户的 role 已更新为 'admin'

## 步骤 2: 验证功能

### 后端验证

代码已经更新，包含以下逻辑：

1. **次数检查跳过**（`analysisService.ts`）:
   ```typescript
   // Admin 用户跳过次数检查
   if (user.role !== 'admin' && user.remainingCredits < 1) {
     throw new ApiError('次数不足', 403, 'INSUFFICIENT_CREDITS');
   }
   ```

2. **次数扣减跳过**（`analysisService.ts`）:
   ```typescript
   // Admin 用户不扣除次数
   if (user.role !== 'admin') {
     await userService.consumeCredits(userId, 1);
     await creditTransactionRepository.create({
       userId,
       amount: -1,
       type: 'consume',
       description: '分析消耗一次'
     });
   }
   ```

### 功能测试

1. 使用账号 17780504161 登录系统
2. 尝试进行赛事分析
3. 确认：
   - ✅ 即使剩余次数为 0，也能正常分析
   - ✅ 分析后次数不会减少
   - ✅ 没有"次数不足"的错误提示

## 技术说明

### 数据库 Schema

```sql
users (
  id UUID PRIMARY KEY,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  nickname VARCHAR(50),
  remaining_credits INT,
  role VARCHAR(20) DEFAULT 'user',  -- 新增字段
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### 角色说明

- `user`: 普通用户，受次数限制
- `admin`: 管理员，无限次数

### 相关代码文件

- `/apps/backend/src/models/types.ts` - UserRecord 接口添加 role 字段
- `/apps/backend/src/repositories/userRepository.ts` - 支持 role 的读写
- `/apps/backend/src/services/analysisService.ts` - 跳过 admin 次数检查和扣减
- `/apps/backend/src/services/authService.ts` - 新用户默认 role 为 'user'

## 故障排查

### 问题: 更新失败 "column role does not exist"

**原因**: role 列尚未添加到数据库

**解决**: 执行步骤 1 中的 SQL，添加 role 列

### 问题: 仍然提示次数不足

**原因**: 可能是缓存或代码未部署

**解决**:
1. 重启 backend 服务
2. 清除浏览器缓存
3. 重新登录

### 问题: 无法访问 Supabase Dashboard

**原因**: 权限不足

**解决**: 联系 Supabase 项目管理员获取访问权限

## 安全建议

1. **谨慎授予 admin 角色**: 只为可信任的测试账号授予 admin 权限
2. **审计日志**: 考虑为 admin 用户的操作添加日志记录
3. **定期检查**: 定期检查 admin 用户列表，移除不再需要的权限

## 未来扩展

可以考虑添加更多角色类型：

- `vip`: VIP 用户，每月固定次数
- `partner`: 合作伙伴，特殊权限
- `trial`: 试用用户，限时权限

只需在数据库中添加相应的 role 值，并在代码中添加相应的逻辑即可。
