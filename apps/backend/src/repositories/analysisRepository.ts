import type { AnalysisRecord } from '../models/types';
import { ApiError } from '../utils/errors';
import { getSupabaseClient } from '../utils/supabase';
import { DISCLAIMER_TEXT } from '../utils/constants';

const ANALYSIS_TABLE = 'analysis_records';
const ANALYSIS_CREATE_ERROR = '分析记录创建失败';
const ANALYSIS_QUERY_ERROR = '分析记录查询失败';
const ANALYSIS_UPDATE_ERROR = '分析记录更新失败';

type AnalysisRow = {
  id: string;
  user_id: string;
  match_info: AnalysisRecord['matchInfo'];
  result: AnalysisRecord['result'] | null;
  status: AnalysisRecord['status'];
  credit_deducted: boolean;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

function toAnalysisRecord(row: AnalysisRow): AnalysisRecord {
  return {
    id: row.id,
    userId: row.user_id,
    matchInfo: row.match_info,
    result: row.result ?? undefined,
    status: row.status,
    creditDeducted: row.credit_deducted,
    errorMessage: row.error_message ?? undefined,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
    disclaimer: DISCLAIMER_TEXT
  };
}

function toAnalysisUpdates(updates: Partial<AnalysisRecord>): Partial<AnalysisRow> {
  const mapped: Partial<AnalysisRow> = {};
  if ('userId' in updates && updates.userId) {
    mapped.user_id = updates.userId;
  }
  if ('matchInfo' in updates && updates.matchInfo) {
    mapped.match_info = updates.matchInfo;
  }
  if ('result' in updates) {
    mapped.result = updates.result ?? null;
  }
  if ('status' in updates && updates.status) {
    mapped.status = updates.status;
  }
  if ('creditDeducted' in updates && updates.creditDeducted !== undefined) {
    mapped.credit_deducted = updates.creditDeducted;
  }
  if ('errorMessage' in updates) {
    mapped.error_message = updates.errorMessage ?? null;
  }
  if ('completedAt' in updates) {
    mapped.completed_at = updates.completedAt ?? null;
  }
  return mapped;
}

export const analysisRepository = {
  async create(data: Omit<AnalysisRecord, 'id' | 'createdAt'>) {
    const supabase = getSupabaseClient();
    try {
      const { data: created, error } = await supabase
        .from(ANALYSIS_TABLE)
        .insert({
          user_id: data.userId,
          match_info: data.matchInfo,
          result: data.result ?? null,
          status: data.status,
          credit_deducted: data.creditDeducted,
          error_message: data.errorMessage ?? null,
          completed_at: data.completedAt ?? null
        })
        .select('*')
        .single();
      if (error || !created) {
        throw new ApiError(ANALYSIS_CREATE_ERROR, 500, 'UNKNOWN');
      }
      return {
        ...toAnalysisRecord(created as AnalysisRow),
        disclaimer: data.disclaimer ?? DISCLAIMER_TEXT
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ANALYSIS_CREATE_ERROR, 500, 'UNKNOWN');
    }
  },
  async findById(id: string): Promise<AnalysisRecord | null> {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from(ANALYSIS_TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        throw new ApiError(ANALYSIS_QUERY_ERROR, 500, 'UNKNOWN');
      }
      return data ? toAnalysisRecord(data as AnalysisRow) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ANALYSIS_QUERY_ERROR, 500, 'UNKNOWN');
    }
  },
  async listByUser(userId: string) {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from(ANALYSIS_TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        throw new ApiError(ANALYSIS_QUERY_ERROR, 500, 'UNKNOWN');
      }
      if (!data) {
        return [];
      }
      return (data as AnalysisRow[]).map(toAnalysisRecord);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ANALYSIS_QUERY_ERROR, 500, 'UNKNOWN');
    }
  },
  async update(id: string, updates: Partial<AnalysisRecord>) {
    const supabase = getSupabaseClient();
    const mappedUpdates = toAnalysisUpdates(updates);
    try {
      const { data, error } = await supabase
        .from(ANALYSIS_TABLE)
        .update(mappedUpdates)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) {
        throw new ApiError(ANALYSIS_UPDATE_ERROR, 500, 'UNKNOWN');
      }
      return data ? toAnalysisRecord(data as AnalysisRow) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ANALYSIS_UPDATE_ERROR, 500, 'UNKNOWN');
    }
  }
};
