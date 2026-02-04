import type { AnalysisResult, ProductType } from '@fateagent/shared-types';

export interface UserRecord {
  id: string;
  phone: string;
  passwordHash: string;
  nickname?: string;
  remainingCredits: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  id: string;
  orderNo: string;
  userId: string;
  productType: ProductType;
  creditsAmount: number;
  priceCents: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  matchInfo: AnalysisResult['matchInfo'];
  result?: AnalysisResult['result'];
  disclaimer: string;
  createdAt: string;
  completedAt?: string;
  creditDeducted: boolean;
  errorMessage?: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'consume' | 'refund';
  orderId?: string;
  description?: string;
  createdAt: string;
}
