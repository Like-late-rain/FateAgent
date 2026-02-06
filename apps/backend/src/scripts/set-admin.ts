import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { getSupabaseClient } from '../utils/supabase';
import { userRepository } from '../repositories/userRepository';

async function setAdminRole() {
  try {
    console.log('正在设置账号 17780504161 为管理员...\n');

    // 查找用户
    const user = await userRepository.findByPhone('17780504161');

    if (!user) {
      console.error('❌ 用户不存在，请先注册账号 17780504161');
      return;
    }

    console.log('找到用户:', {
      phone: user.phone,
      nickname: user.nickname,
      remainingCredits: user.remainingCredits,
      role: user.role || '(未设置)'
    });

    // 首先尝试添加 role 列（如果不存在）
    const supabase = getSupabaseClient();

    console.log('\n尝试添加 role 列到 users 表...');
    const { error: alterError } = await supabase.rpc('exec', {
      sql: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'role'
          ) THEN
            ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
            CREATE INDEX idx_users_role ON users(role);
          END IF;
        END $$;
      `
    });

    if (alterError) {
      console.log('⚠️  无法通过 RPC 添加列，尝试直接更新...');
      console.log('   ', alterError.message);
    } else {
      console.log('✅ role 列已添加或已存在');
    }

    // 更新用户为 admin
    console.log('\n更新用户角色为 admin...');
    const updated = await userRepository.update(user.id, {
      role: 'admin'
    });

    if (!updated) {
      console.error('❌ 更新失败');
      return;
    }

    console.log('\n✅ 成功！账号 17780504161 已设置为管理员');
    console.log('更新后的信息:', {
      phone: updated.phone,
      nickname: updated.nickname,
      remainingCredits: updated.remainingCredits,
      role: updated.role
    });

    console.log('\n现在账号 17780504161 拥有无限次分析权限！');
  } catch (error) {
    console.error('❌ 执行失败:', error);

    if (error instanceof Error) {
      console.error('\n错误详情:', error.message);

      if (error.message.includes('column') && error.message.includes('role')) {
        console.log('\n需要手动在 Supabase Dashboard 中执行以下 SQL:');
        console.log('--------------------------------------------------');
        console.log('ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT \'user\';');
        console.log('CREATE INDEX idx_users_role ON users(role);');
        console.log('UPDATE users SET role = \'admin\' WHERE phone = \'17780504161\';');
        console.log('--------------------------------------------------');
      }
    }
  }
}

setAdminRole();
