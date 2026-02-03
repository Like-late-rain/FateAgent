'use client';

import { Card } from '@/components/ui/card';
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
        <h1 className="font-display text-2xl font-semibold">购买次数</h1>
        <p className="mt-2 text-sm text-ink/70">选择套餐并完成支付。</p>
      </Card>
      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCT_OPTIONS.map((product) => (
          <Card key={product.type} className="flex h-full flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
                {product.label}
              </p>
              <p className="mt-2 text-3xl font-semibold">{product.credits} 次</p>
            </div>
            <p className="text-sm text-ink/70">价格：¥{product.price}</p>
            <Button
              disabled={createOrderMutation.isPending}
              onClick={() =>
                createOrderMutation.mutate({ productType: product.type })
              }
            >
              {createOrderMutation.isPending ? '处理中...' : '立即购买'}
            </Button>
          </Card>
        ))}
      </div>
      {createOrderMutation.isPending && <Loading label="创建订单..." />}
      {createOrderMutation.isError && (
        <ErrorMessage message="订单创建失败，请稍后重试。" />
      )}
      {createOrderMutation.data?.success && (
        <Card>
          <p className="text-sm text-ink/70">
            订单已创建（Mock），请前往支付页完成支付。
          </p>
        </Card>
      )}
    </div>
  );
}
