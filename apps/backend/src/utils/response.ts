import type { ApiResponse } from '@fateagent/shared-types';

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function failure(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } };
}
