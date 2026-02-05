import { chatCompletion, parseJsonResponse } from './openaiService.js';
import { ANALYSIS_SYSTEM_PROMPT, DISCLAIMER } from '../prompts/analysisPrompt.js';
import {
  getTeamData,
  getHeadToHeadData,
  formatDataForPrompt
} from './footballDataService.js';
import type { AnalysisPayload, AnalysisResult } from '../types/index.js';

interface AnalysisResponse {
  result: AnalysisResult;
  disclaimer: string;
}

export async function analyzeMatch(payload: AnalysisPayload): Promise<AnalysisResponse> {
  const { homeTeam, awayTeam, competition, matchDate } = payload;

  console.log(`[Analysis] Analyzing: ${homeTeam} vs ${awayTeam} (${competition}, ${matchDate})`);

  // 获取足球数据
  let dataContext = '';
  try {
    const [homeData, awayData, headToHead] = await Promise.all([
      getTeamData(homeTeam),
      getTeamData(awayTeam),
      getHeadToHeadData(homeTeam, awayTeam)
    ]);

    dataContext = formatDataForPrompt(homeTeam, awayTeam, homeData, awayData, headToHead);
    if (dataContext) {
      console.log(`[Analysis] Data context:\n${dataContext}`);
    }
  } catch (error) {
    console.error('[Analysis] Error fetching data:', error);
  }

  // 构建用户消息
  const userMessage = buildUserMessage(payload, dataContext);
  console.log(`[Analysis] User message:\n${userMessage}`);

  // 调用 OpenAI
  const content = await chatCompletion(ANALYSIS_SYSTEM_PROMPT, userMessage);
  console.log(`[Analysis] Response:\n${content}`);

  const result = parseJsonResponse<AnalysisResult>(content);

  // 验证并修正概率
  if (result.winProbability) {
    const total = result.winProbability.homeWin + result.winProbability.draw + result.winProbability.awayWin;
    if (Math.abs(total - 1.0) > 0.01) {
      console.warn(`[Analysis] Win probability sum is ${total}, normalizing...`);
      result.winProbability.homeWin = Number((result.winProbability.homeWin / total).toFixed(2));
      result.winProbability.draw = Number((result.winProbability.draw / total).toFixed(2));
      result.winProbability.awayWin = Number((1 - result.winProbability.homeWin - result.winProbability.draw).toFixed(2));
    }
  }

  return {
    result,
    disclaimer: DISCLAIMER
  };
}

function buildUserMessage(payload: AnalysisPayload, dataContext: string): string {
  const { homeTeam, awayTeam, competition, matchDate } = payload;

  let message = `请分析以下比赛：

【比赛信息】
- 主队：${homeTeam}
- 客队：${awayTeam}
- 赛事：${competition}
- 比赛日期：${matchDate}

【重要提醒】
这是一场尚未进行的比赛，请基于历史数据进行预测分析。
严格使用以下球队名称：主队"${homeTeam}"，客队"${awayTeam}"`;

  if (dataContext) {
    message += `

【参考数据】
${dataContext}`;
  } else {
    message += `

【注意】
未获取到实时数据，请基于你的历史知识进行分析。`;
  }

  return message;
}

export function getDisclaimer(): string {
  return DISCLAIMER;
}
