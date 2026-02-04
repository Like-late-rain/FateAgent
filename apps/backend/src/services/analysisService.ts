import type {
  AnalysisRequest,
  AnalysisResult,
  PaginatedResponse
} from '@fateagent/shared-types';
import { analysisRepository } from '../repositories/analysisRepository';
import { creditTransactionRepository } from '../repositories/creditTransactionRepository';
import { userService } from './userService';
import { ApiError } from '../utils/errors';
import type { AnalysisRecord } from '../models/types';
import { agentService } from './agentService';

function toAnalysisResult(record: AnalysisRecord): AnalysisResult {
  return {
    id: record.id,
    status: record.status,
    matchInfo: record.matchInfo,
    result: record.result,
    disclaimer: record.disclaimer,
    createdAt: record.createdAt,
    completedAt: record.completedAt
  };
}

export const analysisService = {
  async createAnalysis(userId: string, data: AnalysisRequest) {
    const user = await userService.getUserById(userId);
    if (user.remainingCredits < 1) {
      throw new ApiError('次数不足', 403, 'INSUFFICIENT_CREDITS');
    }

    const record = await analysisRepository.create({
      userId,
      status: 'processing',
      matchInfo: data,
      disclaimer: agentService.getDisclaimer(),
      creditDeducted: false
    });

    void this.processAnalysis(record.id, data, userId);

    return toAnalysisResult(record);
  },
  async processAnalysis(analysisId: string, payload: AnalysisRequest, userId: string) {
    try {
      const response = await agentService.analyze(payload);
      await userService.consumeCredits(userId, 1);
      await creditTransactionRepository.create({
        userId,
        amount: -1,
        type: 'consume',
        description: '分析消耗一次'
      });
      await analysisRepository.update(analysisId, {
        status: 'completed',
        result: response.prediction,
        completedAt: new Date().toISOString(),
        creditDeducted: true
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '分析失败';
      await analysisRepository.update(analysisId, {
        status: 'failed',
        errorMessage: message,
        result: undefined,
        completedAt: undefined
      });
    }
  },
  async getAnalysis(userId: string, analysisId: string) {
    const record = await analysisRepository.findById(analysisId);
    if (!record || record.userId !== userId) {
      throw new ApiError('分析不存在', 404, 'UNKNOWN');
    }
    return toAnalysisResult(record);
  },
  async listAnalysis(userId: string, page: number, pageSize: number) {
    const all = await analysisRepository.listByUser(userId);
    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize).map(toAnalysisResult);
    const response: PaginatedResponse<AnalysisResult> = {
      items,
      total: all.length,
      page,
      pageSize,
      hasMore: start + pageSize < all.length
    };
    return response;
  }
};
