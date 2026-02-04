'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PRODUCT_OPTIONS } from '@/utils/constants';

export default function PricingPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">价格方案</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          按次购买，随用随买，随时查看剩余次数。
        </p>
      </div>
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
              <Link href="/dashboard/purchase">
                <Button className="w-full">购买次数</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground">
        未登录也可浏览价格，购买时会引导登录。
      </div>
    </div>
  );
}
