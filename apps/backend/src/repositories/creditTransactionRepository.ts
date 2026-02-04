import type { CreditTransaction } from '../models/types';
import { ApiError } from '../utils/errors';
import { getSupabaseClient } from '../utils/supabase';

const CREDIT_TRANSACTIONS_TABLE = 'credit_transactions';
const TRANSACTION_CREATE_ERROR = '交易记录创建失败';
const TRANSACTION_QUERY_ERROR = '交易记录查询失败';

type CreditTransactionRow = {
  id: string;
  user_id: string;
  amount: number;
  type: CreditTransaction['type'];
  order_id: string | null;
  description: string | null;
  created_at: string;
};

export const creditTransactionRepository = {
  async create(data: Omit<CreditTransaction, 'id' | 'createdAt'>) {
    const supabase = getSupabaseClient();
    try {
      const { data: created, error } = await supabase
        .from(CREDIT_TRANSACTIONS_TABLE)
        .insert({
          user_id: data.userId,
          amount: data.amount,
          type: data.type,
          order_id: data.orderId ?? null,
          description: data.description ?? null
        })
        .select('*')
        .single();
      if (error || !created) {
        throw new ApiError(TRANSACTION_CREATE_ERROR, 500, 'UNKNOWN');
      }
      const record = created as CreditTransactionRow;
      return {
        id: record.id,
        userId: record.user_id,
        amount: record.amount,
        type: record.type,
        orderId: record.order_id ?? undefined,
        description: record.description ?? undefined,
        createdAt: record.created_at
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(TRANSACTION_CREATE_ERROR, 500, 'UNKNOWN');
    }
  },
  async listByUser(userId: string) {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from(CREDIT_TRANSACTIONS_TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        throw new ApiError(TRANSACTION_QUERY_ERROR, 500, 'UNKNOWN');
      }
      if (!data) {
        return [];
      }
      return (data as CreditTransactionRow[]).map((record) => ({
        id: record.id,
        userId: record.user_id,
        amount: record.amount,
        type: record.type,
        orderId: record.order_id ?? undefined,
        description: record.description ?? undefined,
        createdAt: record.created_at
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(TRANSACTION_QUERY_ERROR, 500, 'UNKNOWN');
    }
  }
};
