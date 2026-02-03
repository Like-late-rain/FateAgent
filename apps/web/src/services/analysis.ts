import type {
  ApiResponse,
  AnalysisRequest,
  AnalysisResult,
  PaginatedResponse
} from '@fateagent/shared-types';
import { request } from '@/services/http';

export function createAnalysis(
  data: AnalysisRequest
): Promise<ApiResponse<AnalysisResult>> {
  return request<AnalysisResult>('/analysis', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function fetchAnalysis(id: string): Promise<ApiResponse<AnalysisResult>> {
  return request<AnalysisResult>(`/analysis/${id}`);
}

export function fetchAnalysisHistory(
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<AnalysisResult>>> {
  return request<PaginatedResponse<AnalysisResult>>(
    `/analysis?page=${page}&pageSize=${pageSize}`
  );
}
