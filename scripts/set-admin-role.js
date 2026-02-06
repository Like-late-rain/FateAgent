const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误: 请设置 SUPABASE_URL 和 SUPABASE_SERVICE_KEY 环境变量');
  process.exit(1);
}

async function setAdminRole() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('正在设置账号 17780504161 为管理员...\n');

  // 先检查用户是否存在以及当前的 role 列是否存在
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('phone', '17780504161')
    .maybeSingle();

  if (userError) {
    console.error('查询用户失败:', userError);
    return;
  }

  if (!userData) {
    console.error('❌ 用户不存在，请先注册账号 17780504161');
    return;
  }

  console.log('找到用户:', {
    phone: userData.phone,
    nickname: userData.nickname,
    remaining_credits: userData.remaining_credits,
    role: userData.role || '(未设置)'
  });

  // 检查 role 列是否存在
  if (!('role' in userData)) {
    console.log('\n⚠️  role 字段不存在，需要先在 Supabase Dashboard 中添加该字段');
    console.log('\n请在 Supabase SQL Editor 中执行以下 SQL:');
    console.log('--------------------------------------------------');
    console.log('ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT \'user\';');
    console.log('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);');
    console.log('--------------------------------------------------\n');
    console.log('添加字段后，再运行此脚本更新用户角色。');
    return;
  }

  // 更新用户为 admin
  const { data: updateData, error: updateError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('phone', '17780504161')
    .select();

  if (updateError) {
    console.error('❌ 更新失败:', updateError);
    return;
  }

  console.log('\n✅ 成功！账号 17780504161 已设置为管理员');
  console.log('更新后的信息:', updateData[0]);
}

setAdminRole().catch(console.error);
