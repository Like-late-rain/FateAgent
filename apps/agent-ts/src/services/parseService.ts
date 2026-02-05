import { chatCompletion, parseJsonResponse } from './openaiService.js';
import { PARSE_SYSTEM_PROMPT } from '../prompts/parsePrompt.js';
import type { ParseResult } from '../types/index.js';

interface ParseResponse {
  success: boolean;
  parsed?: ParseResult;
  error?: string;
}

interface RawParseResult {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string;
  confidence: number;
}

export async function parseMatchQuery(query: string): Promise<ParseResponse> {
  try {
    console.log(`[Parse] Parsing query: ${query}`);

    const content = await chatCompletion(PARSE_SYSTEM_PROMPT, query);
    console.log(`[Parse] Response: ${content}`);

    const parsed = parseJsonResponse<RawParseResult>(content);

    // 验证必需字段
    const homeTeam = parsed.homeTeam?.trim() || '';
    const awayTeam = parsed.awayTeam?.trim() || '';
    const competition = parsed.competition?.trim() || '';
    const matchDate = parsed.matchDate?.trim() || '';
    let confidence = parsed.confidence ?? 0.5;

    if (!homeTeam || !awayTeam) {
      return {
        success: false,
        error: '无法识别比赛双方球队，请明确说明主队和客队'
      };
    }

    // 如果关键信息缺失，降低置信度
    if (!competition) {
      confidence = Math.min(confidence, 0.5);
    }
    if (!matchDate) {
      confidence = Math.min(confidence, 0.5);
    }

    return {
      success: true,
      parsed: {
        homeTeam,
        awayTeam,
        competition: competition || '未知赛事',
        matchDate: matchDate || extractYearFromQuery(query),
        confidence,
        originalQuery: query
      }
    };
  } catch (error) {
    console.error('[Parse] Error:', error);
    const message = error instanceof Error ? error.message : '解析失败';
    return {
      success: false,
      error: message
    };
  }
}

function extractYearFromQuery(query: string): string {
  const yearMatch = query.match(/20[2-3]\d/);
  const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
  return `${year}-01-01`;
}
