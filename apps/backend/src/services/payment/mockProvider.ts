import type { OrderRecord } from '../../models/types';
import type { PaymentProvider, PaymentResult } from './types';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * 模拟支付 Provider
 * 用于开发和测试，跳转到前端模拟支付页面
 */
export const mockPaymentProvider: PaymentProvider = {
  async createPayment(order: OrderRecord): Promise<{ payUrl: string }> {
    // 生成模拟支付页面 URL，对参数进行编码
    const params = new URLSearchParams({
      orderNo: order.orderNo,
      amount: String(order.priceCents)
    });
    const payUrl = `${FRONTEND_URL}/pay/mock?${params.toString()}`;
    return { payUrl };
  },

  async verifyCallback(_payload: unknown): Promise<boolean> {
    // 模拟支付始终验证通过
    return true;
  },

  async queryPayment(orderNo: string): Promise<PaymentResult> {
    // 模拟查询，返回已支付状态
    return {
      success: true,
      transactionId: `MOCK_${orderNo}_${Date.now()}`
    };
  }
};
