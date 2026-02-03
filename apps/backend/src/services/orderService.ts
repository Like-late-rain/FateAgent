import { randomUUID } from 'node:crypto';
import type { CreateOrderRequest, OrderInfo, ProductType } from '@fateagent/shared-types';
import { ERROR_CODES, ERROR_MESSAGES, ORDER_STATUS } from '../constants';
import { findUserById, updateUserCredits } from '../repositories/userRepository';
import { createOrder as storeOrder, findOrderByOrderNo, updateOrder } from '../repositories/orderRepository';
import type { OrderRecord } from '../models/order';

const PRODUCT_CATALOG: Record<ProductType, { credits: number; priceCents: number }> = {
  credits_10: { credits: 10, priceCents: 1000 },
  credits_30: { credits: 30, priceCents: 2500 },
  credits_100: { credits: 100, priceCents: 7000 },
};

const ORDER_PREFIX = 'ORDER';

function generateOrderNo() {
  return `${ORDER_PREFIX}-${randomUUID()}`;
}

export function createOrder(userId: string, payload: CreateOrderRequest): OrderInfo {
  const user = findUserById(userId);
  if (!user) {
    const error = new Error(ERROR_MESSAGES.userNotFound);
    (error as { code?: string }).code = ERROR_CODES.NOT_FOUND;
    throw error;
  }
  const config = PRODUCT_CATALOG[payload.productType];
  const record: OrderRecord = {
    id: randomUUID(),
    orderNo: generateOrderNo(),
    userId: user.id,
    productType: payload.productType,
    creditsAmount: config.credits,
    priceCents: config.priceCents,
    status: ORDER_STATUS.pending,
    createdAt: new Date().toISOString(),
  };
  storeOrder(record);
  return record;
}

export function handleOrderCallback(orderNo: string, status: 'paid' | 'failed'): OrderInfo {
  const order = findOrderByOrderNo(orderNo);
  if (!order) {
    const error = new Error(ERROR_MESSAGES.orderNotFound);
    (error as { code?: string }).code = ERROR_CODES.NOT_FOUND;
    throw error;
  }
  if (order.status === ORDER_STATUS.paid) {
    return order;
  }
  const updated: OrderRecord = { ...order, status };
  updateOrder(updated);
  if (status === ORDER_STATUS.paid) {
    const user = findUserById(order.userId);
    if (!user) {
      const error = new Error(ERROR_MESSAGES.userNotFound);
      (error as { code?: string }).code = ERROR_CODES.NOT_FOUND;
      throw error;
    }
    updateUserCredits(user.id, user.remainingCredits + order.creditsAmount);
  }
  return updated;
}
