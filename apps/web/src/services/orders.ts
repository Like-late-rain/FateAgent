import type {
  ApiResponse,
  CreateOrderRequest,
  OrderInfo
} from '@fateagent/shared-types';
import { request } from '@/services/http';

export function createOrder(
  data: CreateOrderRequest
): Promise<ApiResponse<OrderInfo>> {
  return request<OrderInfo>('/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
