import type { UserRecord } from '../models/types';
import { ApiError } from '../utils/errors';
import { getSupabaseClient } from '../utils/supabase';

const USERS_TABLE = 'users';
const USER_QUERY_ERROR = '用户查询失败';
const USER_CREATE_ERROR = '用户创建失败';
const USER_UPDATE_ERROR = '用户更新失败';

type UserRow = {
  id: string;
  phone: string;
  password_hash: string;
  nickname: string | null;
  remaining_credits: number;
  created_at: string;
  updated_at: string;
};

function toUserRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    phone: row.phone,
    passwordHash: row.password_hash,
    nickname: row.nickname ?? undefined,
    remainingCredits: row.remaining_credits,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toUserUpdates(updates: Partial<UserRecord>): Partial<UserRow> {
  const mapped: Partial<UserRow> = {};
  if ('phone' in updates && updates.phone) {
    mapped.phone = updates.phone;
  }
  if ('passwordHash' in updates && updates.passwordHash) {
    mapped.password_hash = updates.passwordHash;
  }
  if ('nickname' in updates) {
    mapped.nickname = updates.nickname ?? null;
  }
  if ('remainingCredits' in updates && updates.remainingCredits !== undefined) {
    mapped.remaining_credits = updates.remainingCredits;
  }
  mapped.updated_at = new Date().toISOString();
  return mapped;
}

export const userRepository = {
  async findByPhone(phone: string): Promise<UserRecord | null> {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from(USERS_TABLE)
        .select('*')
        .eq('phone', phone)
        .maybeSingle();
      if (error) {
        throw new ApiError(USER_QUERY_ERROR, 500, 'UNKNOWN');
      }
      return data ? toUserRecord(data as UserRow) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(USER_QUERY_ERROR, 500, 'UNKNOWN');
    }
  },
  async findById(id: string): Promise<UserRecord | null> {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from(USERS_TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        throw new ApiError(USER_QUERY_ERROR, 500, 'UNKNOWN');
      }
      return data ? toUserRecord(data as UserRow) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(USER_QUERY_ERROR, 500, 'UNKNOWN');
    }
  },
  async create(data: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const supabase = getSupabaseClient();
    try {
      const { data: created, error } = await supabase
        .from(USERS_TABLE)
        .insert({
          phone: data.phone,
          password_hash: data.passwordHash,
          nickname: data.nickname ?? null,
          remaining_credits: data.remainingCredits
        })
        .select('*')
        .single();
      if (error || !created) {
        throw new ApiError(USER_CREATE_ERROR, 500, 'UNKNOWN');
      }
      return toUserRecord(created as UserRow);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(USER_CREATE_ERROR, 500, 'UNKNOWN');
    }
  },
  async update(id: string, updates: Partial<UserRecord>) {
    const supabase = getSupabaseClient();
    const mappedUpdates = toUserUpdates(updates);
    if (Object.keys(mappedUpdates).length === 0) {
      return this.findById(id);
    }
    try {
      const { data, error } = await supabase
        .from(USERS_TABLE)
        .update(mappedUpdates)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw new ApiError(USER_UPDATE_ERROR, 500, 'UNKNOWN');
      }
      return data ? toUserRecord(data as UserRow) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(USER_UPDATE_ERROR, 500, 'UNKNOWN');
    }
  }
};
