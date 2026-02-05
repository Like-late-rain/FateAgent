import type { PaymentProvider, PaymentProviderType } from './types';
import { mockPaymentProvider } from './mockProvider';

export type { PaymentProvider, PaymentProviderType, PaymentResult } from './types';

const providers: Record<PaymentProviderType, PaymentProvider> = {
  mock: mockPaymentProvider,
  wechat: mockPaymentProvider, // TODO: 实现真实微信支付
  alipay: mockPaymentProvider // TODO: 实现真实支付宝
};

/**
 * 获取当前配置的支付 Provider
 */
export function getPaymentProvider(): PaymentProvider {
  const type = (process.env.PAYMENT_PROVIDER || 'mock') as PaymentProviderType;
  return providers[type] || mockPaymentProvider;
}
