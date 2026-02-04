import type { ApiResponse, UserInfo } from '@fateagent/shared-types';
import { request } from '@/services/http';

export function fetchMe(): Promise<ApiResponse<UserInfo>> {
  return request<UserInfo>('/users/me');
}

export function fetchCredits(): Promise<ApiResponse<{ remainingCredits: number }>> {
  return request<{ remainingCredits: number }>('/users/me/credits');
}
