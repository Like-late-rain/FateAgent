'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function RegisterPage() {
  const { registerMutation } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [smsCode, setSmsCode] = useState('');

  const canSubmit = phone.length > 0 && password.length > 0 && smsCode.length > 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Card title="注册账号" description="创建账号以开始分析。">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmit) {
              return;
            }
            registerMutation.mutate({ phone, password, smsCode });
          }}
        >
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            手机号
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2"
              placeholder="请输入手机号"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2"
              placeholder="请输入密码"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            短信验证码
            <input
              value={smsCode}
              onChange={(event) => setSmsCode(event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2"
              placeholder="请输入验证码"
              required
            />
          </label>
          {registerMutation.isError ? (
            <p className="text-sm text-red-500">注册失败，请检查输入。</p>
          ) : null}
          <PrimaryButton type="submit" disabled={!canSubmit || registerMutation.isPending}>
            {registerMutation.isPending ? '提交中...' : '注册'}
          </PrimaryButton>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-slate-500">
        已有账号？
        <Link href="/login" className="text-slate-900">
          立即登录
        </Link>
      </p>
    </main>
  );
}
