import type { ApiResponse } from '@fateagent/shared-types';

function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }
  return apiUrl;
}

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const baseUrl = getApiUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {})
      },
      credentials: 'include'
    });

    const data = (await res.json()) as ApiResponse<T>;
    if (!res.ok) {
      return {
        success: false,
        error: data.error ?? { code: 'UNKNOWN', message: '请求失败' }
      };
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : '请求异常';
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message }
    };
  }
}
