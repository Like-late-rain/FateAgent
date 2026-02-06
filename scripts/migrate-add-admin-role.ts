import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// 从环境变量读取配置
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误: 请设置 SUPABASE_URL 和 SUPABASE_SERVICE_KEY 环境变量');
  process.exit(1);
}

async function runMigration() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 读取 SQL 文件
  const sqlPath = path.join(__dirname, '../docs/database-migration-add-admin-role.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('开始执行数据库迁移...');
  console.log('SQL 内容:');
  console.log(sql);
  console.log('\n执行中...\n');

  // 将 SQL 拆分成单独的语句执行
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  for (const statement of statements) {
    if (!statement) continue;

    console.log(`执行: ${statement.substring(0, 100)}...`);

    const { data, error } = await supabase.rpc('exec_sql', {
      query: statement
    });

    if (error) {
      console.error('执行失败:', error);
      console.log('尝试直接使用 from 方法更新...');

      // 如果是更新语句，尝试使用 Supabase SDK
      if (statement.includes('UPDATE users')) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('phone', '17780504161');

        if (updateError) {
          console.error('更新失败:', updateError);
          throw updateError;
        } else {
          console.log('✅ 账号 17780504161 已设置为 admin');
        }
      } else if (statement.includes('ALTER TABLE users')) {
        console.log('⚠️  需要手动执行 ALTER TABLE 语句，或通过 Supabase Dashboard 添加');
      }
    } else {
      console.log('✅ 执行成功');
    }
  }

  console.log('\n✅ 数据库迁移完成！');
  console.log('\n验证结果...');

  // 验证迁移结果
  const { data: user, error: queryError } = await supabase
    .from('users')
    .select('phone, role, remaining_credits')
    .eq('phone', '17780504161')
    .single();

  if (queryError) {
    console.error('查询失败:', queryError);
  } else {
    console.log('账号信息:', user);
  }
}

runMigration().catch(console.error);
