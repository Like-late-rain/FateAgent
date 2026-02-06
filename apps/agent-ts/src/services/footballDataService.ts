import type { TeamData, MatchRecord, InjuryInfo } from '../types/index.js';

const FOOTBALL_API_BASE = 'https://v3.football.api-sports.io';

// 国家队名称中英文映射
const NATIONAL_TEAM_NAME_MAP: Record<string, string> = {
  '墨西哥': 'Mexico',
  '南非': 'South Africa',
  '巴西': 'Brazil',
  '阿根廷': 'Argentina',
  '德国': 'Germany',
  '法国': 'France',
  '英格兰': 'England',
  '西班牙': 'Spain',
  '意大利': 'Italy',
  '荷兰': 'Netherlands',
  '葡萄牙': 'Portugal',
  '比利时': 'Belgium',
  '克罗地亚': 'Croatia',
  '乌拉圭': 'Uruguay',
  '哥伦比亚': 'Colombia',
  '日本': 'Japan',
  '韩国': 'South Korea',
  '澳大利亚': 'Australia',
  '美国': 'USA',
  '加拿大': 'Canada',
  '曼城': 'Manchester City',
  '利物浦': 'Liverpool',
  '曼联': 'Manchester United',
  '阿森纳': 'Arsenal',
  '切尔西': 'Chelsea',
  '皇马': 'Real Madrid',
  '巴塞罗那': 'Barcelona',
  '拜仁': 'Bayern Munich'
};

function translateTeamName(teamName: string): string {
  return NATIONAL_TEAM_NAME_MAP[teamName] || teamName;
}

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY;
}

async function makeRequest<T>(endpoint: string, params: Record<string, string | number>): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log('[FootballData] API key not configured');
    return null;
  }

  const url = new URL(`${FOOTBALL_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'x-apisports-key': apiKey
      }
    });

    if (!response.ok) {
      console.error(`[FootballData] Request failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.results === 0) {
      return null;
    }

    return data as T;
  } catch (error) {
    console.error('[FootballData] Request error:', error);
    return null;
  }
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

async function searchTeam(teamName: string): Promise<number | null> {
  const searchName = translateTeamName(teamName);
  console.log(`[FootballData] Searching team: ${teamName} -> ${searchName}`);

  const data = await makeRequest<TeamSearchResponse>('/teams', { search: searchName });
  if (!data?.response?.length) {
    return null;
  }

  // 优先选择国家队
  for (const item of data.response) {
    if (item.team.national === true) {
      return item.team.id;
    }
  }

  return data.response[0].team.id;
}

interface FixturesResponse {
  response: Array<{
    fixture: {
      id: number;
      date: string;
    };
    league: {
      name: string;
      round?: string;
    };
    teams: {
      home: { name: string };
      away: { name: string };
    };
    goals: {
      home: number | null;
      away: number | null;
    };
  }>;
}

async function getTeamFixtures(teamId: number, last = 10): Promise<MatchRecord[]> {
  const data = await makeRequest<FixturesResponse>('/fixtures', { team: teamId, last });
  if (!data?.response) {
    return [];
  }

  return data.response.map(item => ({
    date: item.fixture.date.slice(0, 10),
    competition: item.league.name,
    round: item.league.round,
    home: item.teams.home.name,
    away: item.teams.away.name,
    homeGoals: item.goals.home,
    awayGoals: item.goals.away
  }));
}

interface HeadToHeadResponse {
  response: Array<{
    fixture: {
      date: string;
    };
    league: {
      name: string;
    };
    teams: {
      home: { name: string };
      away: { name: string };
    };
    goals: {
      home: number | null;
      away: number | null;
    };
  }>;
}

async function getHeadToHead(teamId1: number, teamId2: number): Promise<MatchRecord[]> {
  const data = await makeRequest<HeadToHeadResponse>('/fixtures/headtohead', {
    h2h: `${teamId1}-${teamId2}`,
    last: 10
  });
  if (!data?.response) {
    return [];
  }

  return data.response.map(item => ({
    date: item.fixture.date.slice(0, 10),
    competition: item.league.name,
    home: item.teams.home.name,
    away: item.teams.away.name,
    homeGoals: item.goals.home,
    awayGoals: item.goals.away
  }));
}

interface InjuriesResponse {
  response: Array<{
    player: {
      name: string;
      type?: string;
      reason?: string;
    };
    fixture: {
      date: string;
    };
  }>;
}

async function getTeamInjuries(teamId: number): Promise<InjuryInfo[]> {
  const data = await makeRequest<InjuriesResponse>('/injuries', {
    team: teamId,
    season: new Date().getFullYear()
  });
  if (!data?.response) {
    return [];
  }

  return data.response.slice(0, 10).map(item => ({
    player: item.player.name,
    reason: item.player.reason || 'Unknown',
    date: item.fixture.date.slice(0, 10)
  }));
}

export async function getTeamData(teamName: string): Promise<TeamData> {
  const result: TeamData = {};

  const teamId = await searchTeam(teamName);
  if (!teamId) {
    console.log(`[FootballData] Team not found: ${teamName}`);
    return result;
  }

  result.teamId = teamId;
  console.log(`[FootballData] Found team ${teamName} with ID ${teamId}`);

  // 获取近期比赛
  result.recentMatches = await getTeamFixtures(teamId);

  // 获取伤病
  result.injuries = await getTeamInjuries(teamId);

  return result;
}

export async function getHeadToHeadData(homeTeam: string, awayTeam: string): Promise<MatchRecord[]> {
  const homeId = await searchTeam(homeTeam);
  const awayId = await searchTeam(awayTeam);

  if (!homeId || !awayId) {
    return [];
  }

  return getHeadToHead(homeId, awayId);
}

export function formatDataForPrompt(
  homeTeam: string,
  awayTeam: string,
  homeData: TeamData,
  awayData: TeamData,
  headToHead: MatchRecord[]
): string {
  const lines: string[] = [];

  // 主队近期战绩
  if (homeData.recentMatches?.length) {
    lines.push(`=== ${homeTeam} 近期战绩 ===`);
    for (const match of homeData.recentMatches.slice(0, 5)) {
      lines.push(`  ${match.date}: ${match.home} ${match.homeGoals ?? '?'}-${match.awayGoals ?? '?'} ${match.away} (${match.competition})`);
    }
    lines.push('');
  }

  // 客队近期战绩
  if (awayData.recentMatches?.length) {
    lines.push(`=== ${awayTeam} 近期战绩 ===`);
    for (const match of awayData.recentMatches.slice(0, 5)) {
      lines.push(`  ${match.date}: ${match.home} ${match.homeGoals ?? '?'}-${match.awayGoals ?? '?'} ${match.away} (${match.competition})`);
    }
    lines.push('');
  }

  // 历史交锋
  if (headToHead.length) {
    lines.push(`=== 历史交锋 ===`);
    for (const match of headToHead.slice(0, 5)) {
      lines.push(`  ${match.date}: ${match.home} ${match.homeGoals ?? '?'}-${match.awayGoals ?? '?'} ${match.away} (${match.competition})`);
    }
    lines.push('');
  }

  // 主队伤病
  if (homeData.injuries?.length) {
    lines.push(`=== ${homeTeam} 伤病情况 ===`);
    for (const injury of homeData.injuries.slice(0, 5)) {
      lines.push(`  - ${injury.player}: ${injury.reason} (${injury.date})`);
    }
    lines.push('');
  }

  // 客队伤病
  if (awayData.injuries?.length) {
    lines.push(`=== ${awayTeam} 伤病情况 ===`);
    for (const injury of awayData.injuries.slice(0, 5)) {
      lines.push(`  - ${injury.player}: ${injury.reason} (${injury.date})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function isNationalTeamMatch(competition: string): boolean {
  const keywords = ['世界杯', 'world cup', '欧洲杯', 'euro', '美洲杯', 'copa', '亚洲杯', '非洲杯', '国家队', 'national'];
  return keywords.some(kw => competition.toLowerCase().includes(kw));
}
