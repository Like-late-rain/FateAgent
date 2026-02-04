import { randomUUID } from 'crypto';
import type { OrderRecord } from '../models/types';

const orders = new Map<string, OrderRecord>();

export const orderRepository = {
  async create(data: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const order: OrderRecord = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    orders.set(order.id, order);
    return { ...order };
  },
  async findByOrderNo(orderNo: string): Promise<OrderRecord | null> {
    for (const order of orders.values()) {
      if (order.orderNo === orderNo) {
        return { ...order };
      }
    }
    return null;
  },
  async update(id: string, updates: Partial<OrderRecord>) {
    const order = orders.get(id);
    if (!order) {
      return null;
    }
    const updated: OrderRecord = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    orders.set(id, updated);
    return { ...updated };
  }
};
