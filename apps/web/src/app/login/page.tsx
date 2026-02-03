'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function LoginPage() {
  const { loginMutation } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = phone.length > 0 && password.length > 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Card title="欢迎回来" description="请输入账号信息登录。">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmit) {
              return;
            }
            loginMutation.mutate({ phone, password });
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
          {loginMutation.isError ? (
            <p className="text-sm text-red-500">登录失败，请检查账号信息。</p>
          ) : null}
          <PrimaryButton type="submit" disabled={!canSubmit || loginMutation.isPending}>
            {loginMutation.isPending ? '登录中...' : '登录'}
          </PrimaryButton>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-slate-500">
        还没有账号？
        <Link href="/register" className="text-slate-900">
          立即注册
        </Link>
      </p>
    </main>
  );
}
