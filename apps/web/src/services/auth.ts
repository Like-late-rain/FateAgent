import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserInfo } from '@fateagent/shared-types';
import { getJson, postJson } from './apiClient';
import { mockLogin, mockRegister, mockUserProfile, mockCredits } from './mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export function register(payload: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  if (USE_MOCK) {
    return mockRegister(payload);
  }
  return postJson('/auth/register', payload);
}

export function login(payload: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  if (USE_MOCK) {
    return mockLogin(payload);
  }
  return postJson('/auth/login', payload);
}

export function fetchProfile(): Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockUserProfile();
  }
  return getJson('/users/me');
}

export function fetchCredits(): Promise<ApiResponse<{ remainingCredits: number }>> {
  if (USE_MOCK) {
    return mockCredits();
  }
  return getJson('/users/me/credits');
}
