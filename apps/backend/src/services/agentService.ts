import type { AnalysisRequest, AnalysisResult } from '@fateagent/shared-types';
import { DISCLAIMER_TEXT } from '../utils/constants';

type AgentResponse = {
  prediction: AnalysisResult['result'];
};

function buildMockResult(request: AnalysisRequest): AnalysisResult['result'] {
  return {
    prediction: '平局',
    confidence: 0.52,
    analysis: `${request.homeTeam} 与 ${request.awayTeam} 在近期状态接近，预计比赛将以胶着方式进行。`,
    factors: [
      {
        name: '近期状态',
        impact: 'neutral',
        description: '双方近 5 场胜率接近，优势不明显。'
      },
      {
        name: '主客场因素',
        impact: 'positive',
        description: '主队主场得分率略高。'
      }
    ]
  };
}

export const agentService = {
  async analyze(request: AnalysisRequest): Promise<AgentResponse> {
    const baseUrl = process.env.AGENT_SERVICE_URL;
    const apiKey = process.env.AGENT_API_KEY;
    if (!baseUrl || !apiKey) {
      return { prediction: buildMockResult(request) };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${baseUrl}/api/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      const data = (await res.json()) as {
        result?: AnalysisResult['result'];
        disclaimer?: string;
      };
      if (!res.ok || !data.result) {
        return { prediction: buildMockResult(request) };
      }
      return { prediction: data.result };
    } catch (_error) {
      return { prediction: buildMockResult(request) };
    } finally {
      clearTimeout(timeout);
    }
  },
  getDisclaimer() {
    return DISCLAIMER_TEXT;
  }
};
