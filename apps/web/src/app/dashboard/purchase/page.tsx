'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Loading } from '@/components/ui/loading';
import { useOrders } from '@/hooks/use-orders';
import { PRODUCT_OPTIONS } from '@/utils/constants';

export default function PurchasePage() {
  const router = useRouter();
  const { createOrderMutation } = useOrders();

  const handlePurchase = async (productType: 'credits_10' | 'credits_30' | 'credits_100') => {
    const result = await createOrderMutation.mutateAsync({ productType });
    if (result.success && result.data?.payUrl) {
      // 跳转到支付页面（移除域名部分，使用相对路径）
      const url = new URL(result.data.payUrl);
      router.push(url.pathname + url.search);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>购买次数</CardTitle>
          <CardDescription>选择套餐并完成支付，次数将即时到账。</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCT_OPTIONS.map((product) => (
          <Card key={product.type} className="relative overflow-hidden">
            {product.type === 'credits_30' && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl">
                推荐
              </div>
            )}
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {product.label}
              </p>
              <CardTitle className="text-2xl">{product.credits} 次</CardTitle>
              <CardDescription>
                <span className="text-xl font-bold text-foreground">¥{product.price}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ¥{(product.price / product.credits).toFixed(1)}/次
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant={product.type === 'credits_30' ? 'default' : 'outline'}
                disabled={createOrderMutation.isPending}
                onClick={() => handlePurchase(product.type)}
              >
                {createOrderMutation.isPending ? '处理中...' : '立即购买'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {createOrderMutation.isPending && <Loading label="创建订单中..." />}
      {createOrderMutation.isError && (
        <ErrorMessage message="订单创建失败，请稍后重试。" />
      )}
    </div>
  );
}
