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
import { DISCLAIMER_TEXT } from '../utils/constants';

function mockPrediction(request: AnalysisRequest): AnalysisResult['result'] {
  return {
    prediction: '平局',
    confidence: 0.52,
    analysis: `${request.homeTeam} 与 ${request.awayTeam} 在近期状态接近，预计比赛将以胶着方式进行。`,
    factors: [
      {
        name: '近期状态',
        impact: 'neutral',
        description: '双方近 5 场胜率接近，优势不明显。'
      },
      {
        name: '主客场因素',
        impact: 'positive',
        description: '主队主场得分率略高。'
      }
    ]
  };
}

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
      disclaimer: DISCLAIMER_TEXT,
      creditDeducted: false
    });

    void this.processAnalysis(record.id, data, userId);

    return toAnalysisResult(record);
  },
  async processAnalysis(analysisId: string, payload: AnalysisRequest, userId: string) {
    try {
      const response = { prediction: mockPrediction(payload) };
      const updated = await analysisRepository.update(analysisId, {
        status: 'completed',
        result: response.prediction,
        completedAt: new Date().toISOString()
      });
      if (updated && !updated.creditDeducted) {
        await userService.consumeCredits(userId, 1);
        await creditTransactionRepository.create({
          userId,
          amount: -1,
          type: 'consume',
          description: '分析消耗一次'
        });
        await analysisRepository.update(analysisId, { creditDeducted: true });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '分析失败';
      await analysisRepository.update(analysisId, {
        status: 'failed',
        errorMessage: message
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
