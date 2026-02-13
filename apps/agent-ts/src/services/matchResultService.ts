/**
 * 查询比赛实际结果
 */

import { translateTeamName } from './footballDataService.js';

const FOOTBALL_API_BASE = 'https://v3.football.api-sports.io';

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY;
}

interface FixturesResponse {
  response: Array<{
    fixture: {
      id: number;
      date: string;
      status: {
        short: string; // 'FT', 'NS', 'LIVE', etc.
      };
    };
    teams: {
      home: { name: string; id: number };
      away: { name: string; id: number };
    };
    goals: {
      home: number | null;
      away: number | null;
    };
    score: {
      fulltime: {
        home: number | null;
        away: number | null;
      };
    };
  }>;
}

interface TeamSearchResponse {
  response: Array<{
    team: {
      id: number;
      name: string;
      national: boolean;
    };
  }>;
}

async function fetchWithRetry(url: string, apiKey: string, maxRetries = 2): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
    try {
      const response = await fetch(url, { headers: { 'x-apisports-key': apiKey } });
      if (response.status === 429) {
        console.warn(`[MatchResult] Rate limited, attempt ${attempt + 1}/${maxRetries + 1}`);
        lastError = new Error('Rate limited');
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function searchTeam(teamName: string): Promise<number | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log('[MatchResult] API key not configured');
    return null;
  }

  const searchName = translateTeamName(teamName);
  const url = new URL(`${FOOTBALL_API_BASE}/teams`);
  url.searchParams.set('search', searchName);

  try {
    const response = await fetchWithRetry(url.toString(), apiKey);

    if (!response.ok) {
      return null;
    }

    const data: TeamSearchResponse = await response.json();
    if (!data?.response?.length) {
      return null;
    }

    // 优先国家队
    for (const item of data.response) {
      if (item.team.national === true) {
        return item.team.id;
      }
    }

    return data.response[0].team.id;
  } catch (error) {
    console.error('[MatchResult] Search team error:', error);
    return null;
  }
}

/**
 * 查询特定日期两队之间的比赛结果
 */
export async function fetchMatchResult(
  homeTeam: string,
  awayTeam: string,
  matchDate: string // YYYY-MM-DD
): Promise<{
  success: boolean;
  homeScore?: number;
  awayScore?: number;
  status?: string;
  error?: string;
}> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'API key 未配置' };
  }

  try {
    console.log(`[MatchResult] Fetching result for ${homeTeam} vs ${awayTeam} on ${matchDate}`);

    // 搜索球队 ID
    const homeTeamId = await searchTeam(homeTeam);
    const awayTeamId = await searchTeam(awayTeam);

    if (!homeTeamId || !awayTeamId) {
      return { success: false, error: '无法找到球队信息' };
    }

    // 使用 season 参数查询 H2H，而非 date（Free plan 兼容性更好）
    const matchYear = new Date(matchDate).getFullYear();
    // API-Football 赛季年份：跨年赛季用起始年份，如 2024-25 赛季用 2024
    const season = matchYear >= 2025 ? 2024 : matchYear;

    const url = new URL(`${FOOTBALL_API_BASE}/fixtures/headtohead`);
    url.searchParams.set('h2h', `${homeTeamId}-${awayTeamId}`);
    url.searchParams.set('season', String(season));

    const response = await fetchWithRetry(url.toString(), apiKey);

    if (!response.ok) {
      return { success: false, error: 'API 请求失败' };
    }

    const data: FixturesResponse = await response.json();

    if (!data?.response?.length) {
      return { success: false, error: '未找到比赛记录' };
    }

    // 在结果中找到匹配日期的比赛
    const targetDate = matchDate; // YYYY-MM-DD
    const match = data.response.find(m => m.fixture.date.slice(0, 10) === targetDate);

    if (!match) {
      // 尝试前后一天的比赛（时区差异可能导致日期不同）
      const dateObj = new Date(matchDate);
      const prevDate = new Date(dateObj.getTime() - 86400000).toISOString().slice(0, 10);
      const nextDate = new Date(dateObj.getTime() + 86400000).toISOString().slice(0, 10);
      const nearMatch = data.response.find(m => {
        const d = m.fixture.date.slice(0, 10);
        return d === prevDate || d === nextDate;
      });

      if (!nearMatch) {
        return { success: false, error: '未找到该日期的比赛记录' };
      }

      if (nearMatch.fixture.status.short === 'FT' && nearMatch.goals.home !== null && nearMatch.goals.away !== null) {
        // 判断主客场
        const homeTeamEnglish = translateTeamName(homeTeam).toLowerCase();
        const isHomeCorrect = nearMatch.teams.home.name.toLowerCase().includes(homeTeamEnglish) ||
                             homeTeamEnglish.includes(nearMatch.teams.home.name.toLowerCase().substring(0, 5));
        return {
          success: true,
          homeScore: isHomeCorrect ? nearMatch.goals.home : nearMatch.goals.away,
          awayScore: isHomeCorrect ? nearMatch.goals.away : nearMatch.goals.home,
          status: 'FT'
        };
      }

      return {
        success: false,
        error: '比赛尚未结束',
        status: nearMatch.fixture.status.short
      };
    }

    // 检查比赛是否结束
    if (match.fixture.status.short === 'FT' && match.goals.home !== null && match.goals.away !== null) {
      // 判断主客场是否和请求一致
      const homeTeamEnglish = translateTeamName(homeTeam).toLowerCase();
      const isHomeCorrect = match.teams.home.name.toLowerCase().includes(homeTeamEnglish) ||
                           homeTeamEnglish.includes(match.teams.home.name.toLowerCase().substring(0, 5));
      return {
        success: true,
        homeScore: isHomeCorrect ? match.goals.home : match.goals.away,
        awayScore: isHomeCorrect ? match.goals.away : match.goals.home,
        status: 'FT'
      };
    }

    return {
      success: false,
      error: '比赛尚未结束',
      status: match.fixture.status.short
    };
  } catch (error) {
    console.error('[MatchResult] Fetch error:', error);
    return { success: false, error: '查询失败' };
  }
}
