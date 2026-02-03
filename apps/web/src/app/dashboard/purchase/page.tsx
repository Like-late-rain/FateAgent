'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PRODUCT_OPTIONS } from '@/utils/constants';
import { createOrder } from '@/services/orders';

export default function PurchasePage() {
  const [selected, setSelected] = useState(PRODUCT_OPTIONS[0]?.id ?? 'credits_10');
  const [status, setStatus] = useState('');

  return (
    <div className="space-y-6">
      <Card title="购买次数" description="选择合适的套餐完成支付。">
        <div className="grid gap-4 md:grid-cols-3">
          {PRODUCT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={`rounded-lg border px-4 py-5 text-left ${
                selected === option.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
              }`}
            >
              <p className="text-lg font-semibold text-slate-900">{option.name}</p>
              <p className="text-sm text-slate-500">{option.credits} 次</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{option.price}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <PrimaryButton
            onClick={async () => {
              setStatus('创建订单中...');
              const response = await createOrder({ productType: selected });
              if (!response.success) {
                setStatus('订单创建失败，请稍后再试。');
                return;
              }
              setStatus('订单已创建，等待支付完成。');
            }}
          >
            立即购买
          </PrimaryButton>
          {status ? <p className="text-sm text-slate-500">{status}</p> : null}
        </div>
      </Card>
    </div>
  );
}
