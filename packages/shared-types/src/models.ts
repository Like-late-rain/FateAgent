import type { AnalysisResult, OrderInfo, ProductType, UserInfo } from './api';

export type User = UserInfo & {
  updatedAt: string;
};

export type OrderRecord = OrderInfo & {
  userId: string;
  updatedAt: string;
};

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'consume' | 'refund';
  orderId?: string;
  description?: string;
  createdAt: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  status: AnalysisResult['status'];
  matchInfo: AnalysisResult['matchInfo'];
  result?: AnalysisResult['result'];
  disclaimer: string;
  createdAt: string;
  completedAt?: string;
  creditDeducted: boolean;
  errorMessage?: string;
}

export const PRODUCT_CONFIG: Record<ProductType, { credits: number; priceCents: number }> = {
  credits_10: { credits: 10, priceCents: 1000 },
  credits_30: { credits: 30, priceCents: 2500 },
  credits_100: { credits: 100, priceCents: 7000 }
};

export const CREDIT_PACKAGES = [
  { type: 'credits_10', ...PRODUCT_CONFIG.credits_10 },
  { type: 'credits_30', ...PRODUCT_CONFIG.credits_30 },
  { type: 'credits_100', ...PRODUCT_CONFIG.credits_100 }
] as const;

export type CreditPackage = (typeof CREDIT_PACKAGES)[number];
