import type { ApiResponse } from '@fateagent/shared-types';

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function assertApiUrl(): string {
  if (!API_URL) {
    throw new ApiError('MISSING_API_URL', 'API 地址未配置');
  }
  return API_URL;
}

export async function postJson<TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<ApiResponse<TResponse>> {
  const url = `${assertApiUrl()}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  const data = (await response.json()) as ApiResponse<TResponse>;
  if (!response.ok && data.error) {
    throw new ApiError(data.error.code, data.error.message);
  }
  return data;
}

export async function getJson<TResponse>(path: string): Promise<ApiResponse<TResponse>> {
  const url = `${assertApiUrl()}${path}`;
  const response = await fetch(url, { credentials: 'include' });
  const data = (await response.json()) as ApiResponse<TResponse>;
  if (!response.ok && data.error) {
    throw new ApiError(data.error.code, data.error.message);
  }
  return data;
}
