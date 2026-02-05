import type { CreateOrderRequest, OrderInfo } from '@fateagent/shared-types';
import { orderRepository } from '../repositories/orderRepository';
import { creditTransactionRepository } from '../repositories/creditTransactionRepository';
import { PRODUCT_CONFIG } from '../utils/constants';
import { ApiError } from '../utils/errors';
import { userService } from './userService';
import { getPaymentProvider } from './payment';

function generateOrderNo() {
  return `FA${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export interface CreateOrderResult extends OrderInfo {
  payUrl: string;
}

export const orderService = {
  async createOrder(userId: string, data: CreateOrderRequest): Promise<CreateOrderResult> {
    const config = PRODUCT_CONFIG[data.productType];
    if (!config) {
      throw new ApiError('无效产品', 400, 'UNKNOWN');
    }
    const order = await orderRepository.create({
      orderNo: generateOrderNo(),
      userId,
      productType: data.productType,
      creditsAmount: config.credits,
      priceCents: config.priceCents,
      status: 'pending'
    });

    // 获取支付 URL
    const paymentProvider = getPaymentProvider();
    const { payUrl } = await paymentProvider.createPayment(order);

    return {
      id: order.id,
      orderNo: order.orderNo,
      productType: order.productType,
      creditsAmount: order.creditsAmount,
      priceCents: order.priceCents,
      status: order.status,
      createdAt: order.createdAt,
      payUrl
    };
  },

  async handlePaymentCallback(orderNo: string) {
    const order = await orderRepository.findByOrderNo(orderNo);
    if (!order) {
      throw new ApiError('订单不存在', 404, 'UNKNOWN');
    }
    if (order.status === 'paid') {
      return order;
    }
    const updated = await orderRepository.update(order.id, { status: 'paid' });
    if (!updated) {
      throw new ApiError('订单更新失败', 500, 'UNKNOWN');
    }
    await userService.addCredits(order.userId, order.creditsAmount);
    await creditTransactionRepository.create({
      userId: order.userId,
      amount: order.creditsAmount,
      type: 'purchase',
      orderId: order.id,
      description: '订单支付成功'
    });
    return updated;
  },

  async getOrderByNo(orderNo: string) {
    const order = await orderRepository.findByOrderNo(orderNo);
    if (!order) {
      throw new ApiError('订单不存在', 404, 'UNKNOWN');
    }
    return order;
  }
};
