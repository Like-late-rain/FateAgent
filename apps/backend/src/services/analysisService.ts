import { randomUUID } from 'node:crypto';
import type { AnalysisRequest, AnalysisResult, PaginatedResponse } from '@fateagent/shared-types';
import { ANALYSIS_STATUS, CREDIT_DEDUCT_AMOUNT, DEFAULT_DISCLAIMER, ERROR_CODES, ERROR_MESSAGES } from '../constants';
import { findUserById, updateUserCredits } from '../repositories/userRepository';
import { createAnalysis, findAnalysisById, listAnalysesByUser, updateAnalysis } from '../repositories/analysisRepository';
import type { AnalysisRecord } from '../models/analysis';
import { analyzeMatch } from './agentService';

const DEFAULT_PAGE_SIZE = 10;

function toAnalysisResult(record: AnalysisRecord): AnalysisResult {
  return {
    id: record.id,
    status: record.status,
    matchInfo: record.matchInfo,
    result: record.result,
    disclaimer: record.disclaimer,
    createdAt: record.createdAt,
    completedAt: record.completedAt,
  };
}

export async function createAnalysisRequest(userId: string, payload: AnalysisRequest): Promise<AnalysisResult> {
  const user = findUserById(userId);
  if (!user) {
    const error = new Error(ERROR_MESSAGES.userNotFound);
    (error as { code?: string }).code = ERROR_CODES.NOT_FOUND;
    throw error;
  }
  if (user.remainingCredits < CREDIT_DEDUCT_AMOUNT) {
    const error = new Error(ERROR_MESSAGES.insufficientCredits);
    (error as { code?: string }).code = ERROR_CODES.INSUFFICIENT_CREDITS;
    throw error;
  }

  const record: AnalysisRecord = {
    id: randomUUID(),
    userId: user.id,
    matchInfo: payload,
    status: ANALYSIS_STATUS.pending,
    disclaimer: DEFAULT_DISCLAIMER,
    createdAt: new Date().toISOString(),
  };
  createAnalysis(record);

  const processingRecord = { ...record, status: ANALYSIS_STATUS.processing };
  updateAnalysis(processingRecord);

  try {
    const result = await analyzeMatch(payload);
    const completedRecord: AnalysisRecord = {
      ...processingRecord,
      status: ANALYSIS_STATUS.completed,
      result,
      completedAt: new Date().toISOString(),
    };
    updateAnalysis(completedRecord);
    updateUserCredits(user.id, user.remainingCredits - CREDIT_DEDUCT_AMOUNT);
    return toAnalysisResult(completedRecord);
  } catch (error) {
    const failedRecord: AnalysisRecord = {
      ...processingRecord,
      status: ANALYSIS_STATUS.failed,
      errorMessage: error instanceof Error ? error.message : ERROR_MESSAGES.internalError,
      completedAt: new Date().toISOString(),
    };
    updateAnalysis(failedRecord);
    return toAnalysisResult(failedRecord);
  }
}

export function getAnalysis(userId: string, analysisId: string): AnalysisResult {
  const record = findAnalysisById(analysisId);
  if (!record || record.userId !== userId) {
    const error = new Error(ERROR_MESSAGES.analysisNotFound);
    (error as { code?: string }).code = ERROR_CODES.NOT_FOUND;
    throw error;
  }
  return toAnalysisResult(record);
}

export function listAnalysisHistory(
  userId: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginatedResponse<AnalysisResult> {
  const items = listAnalysesByUser(userId);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize).map(toAnalysisResult);
  return {
    items: paged,
    total: items.length,
    page,
    pageSize,
    hasMore: start + pageSize < items.length,
  };
}
