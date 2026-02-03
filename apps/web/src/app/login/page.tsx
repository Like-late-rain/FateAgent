'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { useLoginForm } from '@/hooks/use-login-form';

export default function LoginPage() {
  const { form, onSubmit, isSubmitting, error } = useLoginForm();

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16">
      <Card className="w-full max-w-md">
        <h1 className="font-display text-2xl font-semibold">欢迎回来</h1>
        <p className="mt-2 text-sm text-ink/70">登录后查看你的分析控制台。</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">手机号</label>
            <Input placeholder="请输入手机号" {...form.register('phone')} />
            {form.formState.errors.phone && (
              <p className="text-xs text-red-600">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">密码</label>
            <Input type="password" placeholder="请输入密码" {...form.register('password')} />
            {form.formState.errors.password && (
              <p className="text-xs text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          {error && <ErrorMessage message={error.message} />}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '登录中...' : '登录'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-ink/70">
          还没有账号？
          <Link href="/register" className="ml-2 font-semibold text-tide">
            创建账号
          </Link>
        </p>
      </Card>
    </div>
  );
}
