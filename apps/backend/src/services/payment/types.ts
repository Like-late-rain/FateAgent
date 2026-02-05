import type { OrderRecord } from '../../models/types';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

export interface PaymentProvider {
  /**
   * 创建支付，返回支付 URL 或二维码内容
   */
  createPayment(order: OrderRecord): Promise<{ payUrl: string }>;

  /**
   * 验证支付回调签名
   */
  verifyCallback(payload: unknown): Promise<boolean>;

  /**
   * 查询支付状态
   */
  queryPayment(orderNo: string): Promise<PaymentResult>;
}

export type PaymentProviderType = 'mock' | 'wechat' | 'alipay';