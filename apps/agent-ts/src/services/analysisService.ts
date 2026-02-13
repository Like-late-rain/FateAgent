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
  let dataAvailable = false;
  try {
    const [homeData, awayData, headToHead] = await Promise.all([
      getTeamData(homeTeam),
      getTeamData(awayTeam),
      getHeadToHeadData(homeTeam, awayTeam)
    ]);

    dataContext = formatDataForPrompt(homeTeam, awayTeam, homeData, awayData, headToHead);
    dataAvailable = !!dataContext;
    if (dataContext) {
      console.log(`[Analysis] Data context length: ${dataContext.length} chars`);
    } else {
      console.warn(`[Analysis] No data available for ${homeTeam} vs ${awayTeam}`);
    }
  } catch (error) {
    console.error('[Analysis] Error fetching data:', error);
  }

  // 构建用户消息
  const userMessage = buildUserMessage(payload, dataContext, dataAvailable);

  // 调用 OpenAI
  const content = await chatCompletion(ANALYSIS_SYSTEM_PROMPT, userMessage);
  console.log(`[Analysis] Raw response length: ${content.length} chars`);

  const result = parseJsonResponse<AnalysisResult>(content);

  // 验证并修正概率
  validateAndFixProbabilities(result, dataAvailable);

  return {
    result,
    disclaimer: DISCLAIMER
  };
}

function buildUserMessage(payload: AnalysisPayload, dataContext: string, dataAvailable: boolean): string {
  const { homeTeam, awayTeam, competition, matchDate } = payload;

  let message = `请分析以下比赛：

【比赛信息】
- 主队：${homeTeam}
- 客队：${awayTeam}
- 赛事：${competition}
- 比赛日期：${matchDate}

【重要提醒】
- 这是一场尚未进行的比赛，请基于数据进行预测分析
- 严格使用以下球队名称：主队"${homeTeam}"，客队"${awayTeam}"
- 你的概率计算必须基于下面提供的统计数据，不能凭空估计`;

  if (dataAvailable && dataContext) {
    message += `

【统计数据】
以下是从专业足球数据 API 获取的真实统计数据，请务必以此为分析基础：

${dataContext}

【分析要求】
1. 仔细查看两队的胜率、场均进球、大球率等统计指标
2. 重点关注历史交锋统计（谁赢得多、场均总进球、大球率）
3. 关注近 5 场 form（WWDLW 等），分析近期状态趋势
4. 结合主客场战绩差异
5. 所有概率判断必须引用具体数据`;
  } else {
    message += `

【注意】
未获取到实时数据，请基于你对这两支球队的历史知识进行分析。
由于缺少实时数据支撑，请将 confidence 设置在 0.3-0.5 之间，概率分布应更保守。`;
  }

  return message;
}

function validateWinProbability(result: AnalysisResult): void {
  if (!result.winProbability) return;

  const { homeWin, draw, awayWin } = result.winProbability;
  const total = homeWin + draw + awayWin;

  if (!Number.isFinite(total) || total <= 0) {
    console.warn(`[Analysis] Invalid win probability total: ${total}, using fallback`);
    result.winProbability = { homeWin: 0.40, draw: 0.30, awayWin: 0.30 };
  } else if (Math.abs(total - 1.0) > 0.01) {
    console.warn(`[Analysis] Win probability sum is ${total}, normalizing...`);
    result.winProbability.homeWin = Number((homeWin / total).toFixed(2));
    result.winProbability.draw = Number((draw / total).toFixed(2));
    result.winProbability.awayWin = Number((1 - result.winProbability.homeWin - result.winProbability.draw).toFixed(2));
  }
}

function ensurePredictionConsistency(result: AnalysisResult): void {
  if (!result.winProbability) return;

  const wp = result.winProbability;
  if (wp.homeWin >= wp.draw && wp.homeWin >= wp.awayWin) {
    result.prediction = '主胜';
  } else if (wp.awayWin >= wp.homeWin && wp.awayWin >= wp.draw) {
    result.prediction = '客胜';
  } else {
    result.prediction = '平局';
  }
}

function validateGoalsPrediction(result: AnalysisResult): void {
  if (!result.goalsPrediction) return;

  const gp = result.goalsPrediction;
  const ouTotal = (gp.totalOver2_5 || 0) + (gp.totalUnder2_5 || 0);
  if (ouTotal > 0 && Math.abs(ouTotal - 1.0) > 0.01) {
    gp.totalOver2_5 = Number((gp.totalOver2_5 / ouTotal).toFixed(2));
    gp.totalUnder2_5 = Number((1 - gp.totalOver2_5).toFixed(2));
  }
}

/**
 * 验证和修正 AI 返回的概率值
 */
function validateAndFixProbabilities(result: AnalysisResult, dataAvailable: boolean): void {
  validateWinProbability(result);
  ensurePredictionConsistency(result);
  validateGoalsPrediction(result);

  if (!dataAvailable && result.confidence > 0.5) {
    console.warn(`[Analysis] No data but confidence=${result.confidence}, capping at 0.5`);
    result.confidence = 0.5;
  }
}

export function getDisclaimer(): string {
  return DISCLAIMER;
}
