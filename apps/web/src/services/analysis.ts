import type {
  ApiResponse,
  AnalysisRequest,
  AnalysisResult,
  PaginatedResponse,
  ParseQueryRequest,
  ParseQueryResponse
} from '@fateagent/shared-types';
import { request } from '@/services/http';

export function parseQuery(
  query: string
): Promise<ApiResponse<ParseQueryResponse>> {
  const data: ParseQueryRequest = { query };
  return request<ParseQueryResponse>('/analysis/parse', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

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

// 别名，用于详情页
export const getAnalysis = fetchAnalysis;

export function fetchAnalysisHistory(
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<AnalysisResult>>> {
  return request<PaginatedResponse<AnalysisResult>>(
    `/analysis?page=${page}&pageSize=${pageSize}`
  );
}
