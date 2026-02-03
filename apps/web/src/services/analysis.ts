import type { AnalysisRequest, AnalysisResult, ApiResponse, PaginatedResponse } from '@fateagent/shared-types';
import { getJson, postJson } from './apiClient';
import { mockAnalysisHistory, mockCreateAnalysis } from './mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function createAnalysis(payload: AnalysisRequest): Promise<ApiResponse<AnalysisResult>> {
  if (USE_MOCK) {
    return mockCreateAnalysis();
  }
  return postJson('/analysis', payload);
}

export function fetchAnalysisHistory(): Promise<ApiResponse<PaginatedResponse<AnalysisResult>>> {
  if (USE_MOCK) {
    return mockAnalysisHistory();
  }
  return getJson('/analysis');
}

export function fetchAnalysisDetail(id: string): Promise<ApiResponse<AnalysisResult>> {
  if (USE_MOCK) {
    return mockCreateAnalysis();
  }
  return getJson(`/analysis/${id}`);
}
