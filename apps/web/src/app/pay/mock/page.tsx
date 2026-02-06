'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null);

  const orderNo = searchParams.get('orderNo');
  const amountCents = searchParams.get('amount');
  const amount = amountCents ? (parseInt(amountCents, 10) / 100).toFixed(2) : '0.00';

  const handlePay = async () => {
    if (!orderNo) return;

    setIsPaying(true);

    // 模拟支付延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // 调用支付回调接口
      // 使用环境变量配置 callback token
      const callbackToken = process.env.NEXT_PUBLIC_MOCK_CALLBACK_TOKEN;
      if (!callbackToken) {
        setPaymentResult('failed');
        setIsPaying(false);
        return;
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/orders/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Callback-Token': callbackToken
        },
        body: JSON.stringify({ orderNo }),
        credentials: 'include'
      });

      if (res.ok) {
        setPaymentResult('success');
        // 支付成功后跳转到仪表板
        setTimeout(() => {
          router.push('/dashboard?payment=success');
        }, 2000);
      } else {
        setPaymentResult('failed');
      }
    } catch {
      setPaymentResult('failed');
    } finally {
      setIsPaying(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/purchase');
  };

  if (!orderNo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">无效的订单</p>
            <Button className="w-full mt-4" onClick={() => router.push('/dashboard/purchase')}>
              返回购买页面
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">模拟支付</CardTitle>
          <CardDescription>
            这是一个模拟支付页面，用于开发测试。
            <br />
            正式环境将跳转到真实支付平台。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">订单号</span>
              <span className="font-mono">{orderNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">支付金额</span>
              <span className="text-xl font-bold text-orange-500">¥{amount}</span>
            </div>
          </div>

          {paymentResult === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-600 font-medium">支付成功！</p>
              <p className="text-sm text-green-500 mt-1">正在跳转到仪表板...</p>
            </div>
          )}

          {paymentResult === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 font-medium">支付失败</p>
              <p className="text-sm text-red-500 mt-1">请重试或联系客服</p>
            </div>
          )}

          {isPaying && <Loading label="处理支付中..." />}

          {!paymentResult && !isPaying && (
            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={handlePay}>
                确认支付 ¥{amount}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleCancel}
              >
                取消支付
              </Button>
            </div>
          )}

          {paymentResult === 'failed' && (
            <div className="space-y-3">
              <Button className="w-full" onClick={handlePay}>
                重新支付
              </Button>
              <Button className="w-full" variant="outline" onClick={handleCancel}>
                取消
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<Loading label="加载中..." />}>
      <MockPaymentContent />
    </Suspense>
  );
}
