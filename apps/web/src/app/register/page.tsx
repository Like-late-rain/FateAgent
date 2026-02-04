'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { useRegisterForm } from '@/hooks/use-register-form';

export default function RegisterPage() {
  const { form, onSubmit, isSubmitting, error } = useRegisterForm();

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>创建账号</CardTitle>
          <CardDescription>注册后即可开始赛事分析。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">手机号</label>
              <Input placeholder="请输入手机号" {...form.register('phone')} />
              {form.formState.errors.phone && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">密码</label>
              <Input type="password" placeholder="请输入密码" {...form.register('password')} />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">验证码</label>
              <Input placeholder="短信验证码" {...form.register('smsCode')} />
              {form.formState.errors.smsCode && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.smsCode.message}
                </p>
              )}
            </div>
            {error && <ErrorMessage message={error.message} />}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '注册中...' : '注册'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            已有账号？
            <Link href="/login" className="ml-2 font-medium text-foreground">
              去登录
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
