import type { ProductType } from '@fateagent/shared-types';

export interface OrderRecord {
  id: string;
  orderNo: string;
  userId: string;
  productType: ProductType;
  creditsAmount: number;
  priceCents: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}
