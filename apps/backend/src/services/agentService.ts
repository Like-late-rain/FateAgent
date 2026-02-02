import type { AnalysisRequest, AnalysisResult } from '@fateagent/shared-types';
import { AGENT_RETRY_COUNT, AGENT_TIMEOUT_MS, ERROR_CODES, ERROR_MESSAGES } from '../constants';
import { ENV } from '../config/env';

const AGENT_ENDPOINT = '/api/v1/analyze';
const JSON_HEADERS = { 'Content-Type': 'application/json' };
const API_KEY_HEADER = 'x-api-key';

export async function analyzeMatch(payload: AnalysisRequest): Promise<AnalysisResult['result']> {
  const url = `${ENV.agentServiceUrl}${AGENT_ENDPOINT}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < AGENT_RETRY_COUNT; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);

    try {
      const headers = ENV.agentApiKey
        ? { ...JSON_HEADERS, [API_KEY_HEADER]: ENV.agentApiKey }
        : JSON_HEADERS;
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = (await response.json()) as { success: boolean; data?: AnalysisResult['result'] };
      if (!response.ok || !data.success || !data.data) {
        throw new Error(ERROR_MESSAGES.internalError);
      }
      return data.data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(ERROR_MESSAGES.internalError);
    } finally {
      clearTimeout(timeout);
    }
  }

  const error = new Error(lastError?.message ?? ERROR_MESSAGES.internalError);
  (error as { code?: string }).code = ERROR_CODES.ANALYSIS_FAILED;
  throw error;
}
