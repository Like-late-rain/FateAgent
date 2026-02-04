import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '@fateagent/shared-types';
import { request } from '@/services/http';

export function login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function register(
  data: RegisterRequest
): Promise<ApiResponse<AuthResponse>> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function logout(): Promise<ApiResponse<null>> {
  return request<null>('/auth/logout', { method: 'POST' });
}
