'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Loading } from '@/components/ui/loading';
import { useOrders } from '@/hooks/use-orders';
import { PRODUCT_OPTIONS } from '@/utils/constants';

export default function PurchasePage() {
  const { createOrderMutation } = useOrders();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>购买次数</CardTitle>
          <CardDescription>选择套餐并完成支付。</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCT_OPTIONS.map((product) => (
          <Card key={product.type}>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {product.label}
              </p>
              <CardTitle className="text-2xl">{product.credits} 次</CardTitle>
              <CardDescription>价格：¥{product.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={createOrderMutation.isPending}
                onClick={() =>
                  createOrderMutation.mutate({ productType: product.type })
                }
              >
                {createOrderMutation.isPending ? '处理中...' : '立即购买'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {createOrderMutation.isPending && <Loading label="创建订单..." />}
      {createOrderMutation.isError && (
        <ErrorMessage message="订单创建失败，请稍后重试。" />
      )}
      {createOrderMutation.data?.success && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              订单已创建（Mock），请前往支付页完成支付。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
