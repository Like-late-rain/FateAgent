import type { OrderRecord } from '../models/order';

const orders = new Map<string, OrderRecord>();

export function createOrder(order: OrderRecord): OrderRecord {
  orders.set(order.id, order);
  return order;
}

export function findOrderById(orderId: string): OrderRecord | undefined {
  return orders.get(orderId);
}

export function findOrderByOrderNo(orderNo: string): OrderRecord | undefined {
  return Array.from(orders.values()).find((order) => order.orderNo === orderNo);
}

export function updateOrder(order: OrderRecord): OrderRecord {
  orders.set(order.id, order);
  return order;
}

export function listOrdersByUser(userId: string): OrderRecord[] {
  return Array.from(orders.values()).filter((order) => order.userId === userId);
}
