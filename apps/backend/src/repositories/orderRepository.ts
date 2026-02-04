import type { OrderRecord } from '../models/types';
import { ApiError } from '../utils/errors';
import { getSupabaseClient } from '../utils/supabase';

const ORDERS_TABLE = 'orders';
const ORDER_CREATE_ERROR = '订单创建失败';
const ORDER_QUERY_ERROR = '订单查询失败';
const ORDER_UPDATE_ERROR = '订单更新失败';

type OrderRow = {
  id: string;
  order_no: string;
  user_id: string;
  product_type: string;
  credits_amount: number;
  price_cents: number;
  status: OrderRecord['status'];
  created_at: string;
  updated_at: string;
};

function toOrderRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    orderNo: row.order_no,
    userId: row.user_id,
    productType: row.product_type as OrderRecord['productType'],
    creditsAmount: row.credits_amount,
    priceCents: row.price_cents,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toOrderUpdates(updates: Partial<OrderRecord>): Partial<OrderRow> {
  const mapped: Partial<OrderRow> = {};
  if ('orderNo' in updates && updates.orderNo) {
    mapped.order_no = updates.orderNo;
  }
  if ('userId' in updates && updates.userId) {
    mapped.user_id = updates.userId;
  }
  if ('productType' in updates && updates.productType) {
    mapped.product_type = updates.productType;
  }
  if ('creditsAmount' in updates && updates.creditsAmount !== undefined) {
    mapped.credits_amount = updates.creditsAmount;
  }
  if ('priceCents' in updates && updates.priceCents !== undefined) {
    mapped.price_cents = updates.priceCents;
  }
  if ('status' in updates && updates.status) {
    mapped.status = updates.status;
  }
  mapped.updated_at = new Date().toISOString();
  return mapped;
}

export const orderRepository = {
  async create(data: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const supabase = getSupabaseClient();
    try {
      const { data: created, error } = await supabase
        .from(ORDERS_TABLE)
        .insert({
          order_no: data.orderNo,
          user_id: data.userId,
          product_type: data.productType,
          credits_amount: data.creditsAmount,
          price_cents: data.priceCents,
          status: data.status
        })
        .select('*')
        .single();
      if (error || !created) {
        throw new ApiError(ORDER_CREATE_ERROR, 500, 'UNKNOWN');
      }
      return toOrderRecord(created as OrderRow);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ORDER_CREATE_ERROR, 500, 'UNKNOWN');
    }
  },
  async findByOrderNo(orderNo: string): Promise<OrderRecord | null> {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from(ORDERS_TABLE)
        .select('*')
        .eq('order_no', orderNo)
        .maybeSingle();
      if (error) {
        throw new ApiError(ORDER_QUERY_ERROR, 500, 'UNKNOWN');
      }
      return data ? toOrderRecord(data as OrderRow) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ORDER_QUERY_ERROR, 500, 'UNKNOWN');
    }
  },
  async update(id: string, updates: Partial<OrderRecord>) {
    const supabase = getSupabaseClient();
    const mappedUpdates = toOrderUpdates(updates);
    try {
      const { data, error } = await supabase
        .from(ORDERS_TABLE)
        .update(mappedUpdates)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw new ApiError(ORDER_UPDATE_ERROR, 500, 'UNKNOWN');
      }
      return data ? toOrderRecord(data as OrderRow) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ORDER_UPDATE_ERROR, 500, 'UNKNOWN');
    }
  }
};
