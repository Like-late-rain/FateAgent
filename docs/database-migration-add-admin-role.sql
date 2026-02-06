-- 添加用户角色字段
-- 用于支持管理员无限次分析功能

-- 1. 添加 role 字段到 users 表
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. 为 role 字段添加注释
COMMENT ON COLUMN users.role IS '用户角色：user(普通用户) 或 admin(管理员，拥有无限次分析权限)';

-- 3. 创建索引以加速角色查询
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4. 将账号 17780504161 设置为管理员
UPDATE users
SET role = 'admin'
WHERE phone = '17780504161';
