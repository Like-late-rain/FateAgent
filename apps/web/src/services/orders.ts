import type { ApiResponse, CreateOrderRequest, OrderInfo } from '@fateagent/shared-types';
import { postJson } from './apiClient';
import { mockCreateOrder } from './mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function createOrder(payload: CreateOrderRequest): Promise<ApiResponse<OrderInfo>> {
  if (USE_MOCK) {
    return mockCreateOrder(payload);
  }
  return postJson('/orders', payload);
}
