import type { TeamData, MatchRecord, InjuryInfo } from '../types/index.js';

const FOOTBALL_API_BASE = 'https://v3.football.api-sports.io';

// 球队名称中英文映射（国家队 + 主流俱乐部）
const TEAM_NAME_MAP: Record<string, string> = {
  // 国家队
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
  '中国': 'China',
  '瑞士': 'Switzerland',
  '丹麦': 'Denmark',
  '瑞典': 'Sweden',
  '挪威': 'Norway',
  '波兰': 'Poland',
  '捷克': 'Czech Republic',
  '奥地利': 'Austria',
  '塞尔维亚': 'Serbia',
  '罗马尼亚': 'Romania',
  '希腊': 'Greece',
  '土耳其': 'Turkey',
  '俄罗斯': 'Russia',
  '乌克兰': 'Ukraine',
  '威尔士': 'Wales',
  '苏格兰': 'Scotland',
  '爱尔兰': 'Ireland',
  '智利': 'Chile',
  '秘鲁': 'Peru',
  '厄瓜多尔': 'Ecuador',
  '委内瑞拉': 'Venezuela',
  '巴拉圭': 'Paraguay',
  '尼日利亚': 'Nigeria',
  '喀麦隆': 'Cameroon',
  '加纳': 'Ghana',
  '塞内加尔': 'Senegal',
  '摩洛哥': 'Morocco',
  '突尼斯': 'Tunisia',
  '埃及': 'Egypt',
  '阿尔及利亚': 'Algeria',
  '科特迪瓦': 'Ivory Coast',
  '伊朗': 'Iran',
  '伊拉克': 'Iraq',
  '沙特': 'Saudi Arabia',
  '沙特阿拉伯': 'Saudi Arabia',
  '卡塔尔': 'Qatar',
  '阿联酋': 'United Arab Emirates',

  // 英超
  '曼城': 'Manchester City',
  '利物浦': 'Liverpool',
  '曼联': 'Manchester United',
  '阿森纳': 'Arsenal',
  '切尔西': 'Chelsea',
  '热刺': 'Tottenham',
  '托特纳姆热刺': 'Tottenham',
  '纽卡斯尔': 'Newcastle',
  '纽卡斯尔联': 'Newcastle',
  '阿斯顿维拉': 'Aston Villa',
  '西汉姆': 'West Ham',
  '西汉姆联': 'West Ham',
  '布莱顿': 'Brighton',
  '水晶宫': 'Crystal Palace',
  '狼队': 'Wolverhampton',
  '伯恩茅斯': 'Bournemouth',
  '富勒姆': 'Fulham',
  '布伦特福德': 'Brentford',
  '诺丁汉森林': 'Nottingham Forest',
  '埃弗顿': 'Everton',
  '伯恩利': 'Burnley',
  '谢菲尔德联': 'Sheffield United',
  '卢顿': 'Luton',
  '莱斯特城': 'Leicester',
  '利兹联': 'Leeds',
  '南安普顿': 'Southampton',

  // 西甲
  '皇马': 'Real Madrid',
  '皇家马德里': 'Real Madrid',
  '巴萨': 'Barcelona',
  '巴塞罗那': 'Barcelona',
  '马竞': 'Atletico Madrid',
  '马德里竞技': 'Atletico Madrid',
  '塞维利亚': 'Sevilla',
  '皇家社会': 'Real Sociedad',
  '毕尔巴鄂竞技': 'Athletic Club',
  '毕尔巴鄂': 'Athletic Club',
  '比利亚雷亚尔': 'Villarreal',
  '皇家贝蒂斯': 'Real Betis',
  '贝蒂斯': 'Real Betis',
  '瓦伦西亚': 'Valencia',
  '赫罗纳': 'Girona',
  '奥萨苏纳': 'Osasuna',
  '塞尔塔': 'Celta Vigo',
  '马略卡': 'Mallorca',
  '拉斯帕尔马斯': 'Las Palmas',
  '赫塔菲': 'Getafe',
  '阿拉维斯': 'Alaves',
  '加的斯': 'Cadiz',
  '格拉纳达': 'Granada',

  // 意甲
  '国际米兰': 'Inter',
  '国米': 'Inter',
  'AC米兰': 'AC Milan',
  '米兰': 'AC Milan',
  '尤文图斯': 'Juventus',
  '尤文': 'Juventus',
  '那不勒斯': 'Napoli',
  '罗马': 'AS Roma',
  '拉齐奥': 'Lazio',
  '亚特兰大': 'Atalanta',
  '佛罗伦萨': 'Fiorentina',
  '都灵': 'Torino',
  '博洛尼亚': 'Bologna',
  '蒙扎': 'Monza',
  '乌迪内斯': 'Udinese',
  '萨索洛': 'Sassuolo',
  '热那亚': 'Genoa',
  '卡利亚里': 'Cagliari',
  '弗洛西诺内': 'Frosinone',
  '莱切': 'Lecce',
  '萨勒尼塔纳': 'Salernitana',
  '维罗纳': 'Verona',
  '恩波利': 'Empoli',

  // 德甲
  '拜仁': 'Bayern Munich',
  '拜仁慕尼黑': 'Bayern Munich',
  '多特蒙德': 'Dortmund',
  '勒沃库森': 'Bayer Leverkusen',
  '莱比锡': 'RB Leipzig',
  '莱比锡红牛': 'RB Leipzig',
  '法兰克福': 'Eintracht Frankfurt',
  '斯图加特': 'Stuttgart',
  '沃尔夫斯堡': 'Wolfsburg',
  '门兴': 'Monchengladbach',
  '门兴格拉德巴赫': 'Monchengladbach',
  '弗赖堡': 'Freiburg',
  '柏林联合': 'Union Berlin',
  '奥格斯堡': 'Augsburg',
  '美因茨': 'Mainz',
  '科隆': 'FC Koln',
  '不莱梅': 'Werder Bremen',
  '霍芬海姆': 'Hoffenheim',
  '海登海姆': 'Heidenheim',
  '达姆施塔特': 'Darmstadt',
  '波鸿': 'Bochum',

  // 法甲
  '巴黎圣日耳曼': 'Paris Saint Germain',
  '大巴黎': 'Paris Saint Germain',
  'PSG': 'Paris Saint Germain',
  '马赛': 'Marseille',
  '摩纳哥': 'Monaco',
  '里昂': 'Lyon',
  '里尔': 'Lille',
  '尼斯': 'Nice',
  '雷恩': 'Rennes',
  '朗斯': 'Lens',
  '蒙彼利埃': 'Montpellier',
  '斯特拉斯堡': 'Strasbourg',
  '南特': 'Nantes',
  '图卢兹': 'Toulouse',
  '布雷斯特': 'Brest',
  '兰斯': 'Reims',

  // 葡超
  '本菲卡': 'Benfica',
  '波尔图': 'FC Porto',
  '里斯本竞技': 'Sporting CP',

  // 荷甲
  '阿贾克斯': 'Ajax',
  '费耶诺德': 'Feyenoord',
  'PSV': 'PSV',
  '埃因霍温': 'PSV',

  // 沙特联赛 (Saudi Pro League) - 18支球队
  // 以下英文名称与 API-Football 数据库精确匹配
  '利雅得新月': 'Al-Hilal Saudi FC',
  '新月': 'Al-Hilal Saudi FC',
  '吉达联合': 'Al-Ittihad FC',
  '联合': 'Al-Ittihad FC',
  '利雅得胜利': 'Al-Nassr',
  '胜利': 'Al-Nassr',
  '吉达阿赫利': 'Al-Ahli Jeddah',
  '阿赫利': 'Al-Ahli Jeddah',
  '卡迪西亚': 'Al-Qadisiyah FC',
  '阿尔卡迪西亚': 'Al-Qadisiyah FC',
  '达曼协作': 'Al-Ettifaq',
  '协作': 'Al-Ettifaq',
  '利雅得青年': 'Al Shabab',
  '青年人': 'Al Shabab',
  '布赖代合作': 'Al Taawon',
  '合作': 'Al Taawon',
  '阿尔奥罗巴': 'Al Orubah',
  '欧鲁巴': 'Al Orubah',
  '阿尔利雅德': 'Al Riyadh',
  '哈萨征服': 'Al-Fateh',
  '征服': 'Al-Fateh',
  '阿尔拉亚恩': 'Al-Raed',
  '拉亚恩': 'Al-Raed',
  '费哈': 'Al-Fayha',
  '阿尔费哈': 'Al-Fayha',
  '达马克': 'Damac',
  '阿尔霍利德': 'Al Kholood',
  '阿尔科里亚': 'Al Kholood',
  '阿尔韦赫达': 'Al Wehda Club',
  '韦赫达': 'Al Wehda Club',
  '阿尔奥克杜德': 'Al Okhdood',
  '阿克杜德': 'Al Okhdood',
  '吉达国民': 'Al-Ahli Jeddah',
  '萨伊哈特赫利杰': 'Al Khaleej Saihat',
  '赫利杰': 'Al Khaleej Saihat',

  // 其他中东联赛
  '阿尔艾因': 'Al-Ain',
};

export function translateTeamName(teamName: string): string {
  return TEAM_NAME_MAP[teamName] || teamName;
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

async function getTeamFixtures(teamId: number, limit = 20): Promise<MatchRecord[]> {
  // Free plan 不支持 last 参数，使用 season 参数代替
  // 先尝试当前赛季(2024)，如果没数据则尝试上赛季
  const seasons = [2024, 2023];

  for (const season of seasons) {
    const data = await makeRequest<FixturesResponse>('/fixtures', { team: teamId, season });
    if (data?.response?.length) {
      console.log(`[FootballData] Found ${data.response.length} fixtures for team ${teamId} in season ${season}`);
      // 只返回已完赛的比赛（有比分的），按日期倒序排列，取最近 limit 场
      const matches = data.response
        .filter(item => item.goals.home !== null && item.goals.away !== null)
        .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
        .slice(0, limit)
        .map(item => ({
          date: item.fixture.date.slice(0, 10),
          competition: item.league.name,
          round: item.league.round,
          home: item.teams.home.name,
          away: item.teams.away.name,
          homeGoals: item.goals.home,
          awayGoals: item.goals.away
        }));

      if (matches.length > 0) return matches;
    }
  }

  return [];
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
  // Free plan 不支持 last 参数，改用 season 参数，尝试多个赛季以获取足够的交锋记录
  const seasons = [2024, 2023, 2022];
  const allMatches: MatchRecord[] = [];

  for (const season of seasons) {
    const data = await makeRequest<HeadToHeadResponse>('/fixtures/headtohead', {
      h2h: `${teamId1}-${teamId2}`,
      season
    });
    if (data?.response?.length) {
      console.log(`[FootballData] Found ${data.response.length} H2H fixtures in season ${season}`);
      for (const item of data.response) {
        allMatches.push({
          date: item.fixture.date.slice(0, 10),
          competition: item.league.name,
          home: item.teams.home.name,
          away: item.teams.away.name,
          homeGoals: item.goals.home,
          awayGoals: item.goals.away
        });
      }
    }
    // 如果已经有足够的交锋记录，停止查询以节省 API 调用
    if (allMatches.length >= 10) break;
  }

  // 按日期倒序
  allMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return allMatches.slice(0, 20);
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
  // Free plan 只支持到 2024 赛季，不支持 2025+
  const season = 2024;
  const data = await makeRequest<InjuriesResponse>('/injuries', {
    team: teamId,
    season
  });
  if (!data?.response) {
    return [];
  }

  // 按日期倒序，取最近的伤病信息
  return data.response
    .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
    .slice(0, 10)
    .map(item => ({
      player: item.player.name,
      reason: item.player.reason || 'Unknown',
      date: item.fixture.date.slice(0, 10)
    }));
}

// ============ 统计聚合 ============

interface TeamStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  winRate: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
  avgTotalGoals: number;
  over2_5Rate: number;
  bothTeamsScoreRate: number;
  recentForm: string; // 例如: "WWDLW"
  homeStats?: { wins: number; draws: number; losses: number; matches: number };
  awayStats?: { wins: number; draws: number; losses: number; matches: number };
}

function calculateTeamStats(matches: MatchRecord[], teamName: string, apiTeamName?: string): TeamStats {
  const stats: TeamStats = {
    totalMatches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    winRate: 0,
    avgGoalsFor: 0,
    avgGoalsAgainst: 0,
    avgTotalGoals: 0,
    over2_5Rate: 0,
    bothTeamsScoreRate: 0,
    recentForm: '',
    homeStats: { wins: 0, draws: 0, losses: 0, matches: 0 },
    awayStats: { wins: 0, draws: 0, losses: 0, matches: 0 }
  };

  const validMatches = matches.filter(m => m.homeGoals !== null && m.awayGoals !== null);
  if (validMatches.length === 0) return stats;

  stats.totalMatches = validMatches.length;
  let over2_5Count = 0;
  let btsCount = 0;
  const formArr: string[] = [];

  // 用来匹配 API 返回的球队英文名
  const searchName = apiTeamName || translateTeamName(teamName);

  for (const match of validMatches) {
    const hg = match.homeGoals!;
    const ag = match.awayGoals!;
    const totalGoals = hg + ag;
    const isHome = match.home.toLowerCase().includes(searchName.toLowerCase()) ||
                   searchName.toLowerCase().includes(match.home.toLowerCase().substring(0, 5));
    const gf = isHome ? hg : ag;
    const ga = isHome ? ag : hg;

    stats.goalsFor += gf;
    stats.goalsAgainst += ga;

    if (totalGoals > 2.5) over2_5Count++;
    if (hg > 0 && ag > 0) btsCount++;

    if (gf > ga) {
      stats.wins++;
      formArr.push('W');
      if (isHome) stats.homeStats!.wins++;
      else stats.awayStats!.wins++;
    } else if (gf === ga) {
      stats.draws++;
      formArr.push('D');
      if (isHome) stats.homeStats!.draws++;
      else stats.awayStats!.draws++;
    } else {
      stats.losses++;
      formArr.push('L');
      if (isHome) stats.homeStats!.losses++;
      else stats.awayStats!.losses++;
    }

    if (isHome) stats.homeStats!.matches++;
    else stats.awayStats!.matches++;
  }

  stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
  stats.winRate = Math.round((stats.wins / stats.totalMatches) * 100) / 100;
  stats.avgGoalsFor = Math.round((stats.goalsFor / stats.totalMatches) * 100) / 100;
  stats.avgGoalsAgainst = Math.round((stats.goalsAgainst / stats.totalMatches) * 100) / 100;
  stats.avgTotalGoals = Math.round(((stats.goalsFor + stats.goalsAgainst) / stats.totalMatches) * 100) / 100;
  stats.over2_5Rate = Math.round((over2_5Count / stats.totalMatches) * 100) / 100;
  stats.bothTeamsScoreRate = Math.round((btsCount / stats.totalMatches) * 100) / 100;
  // 最近5场形式
  stats.recentForm = formArr.slice(0, 5).join('');

  return stats;
}

interface H2HStats {
  totalMatches: number;
  team1Wins: number;
  team2Wins: number;
  draws: number;
  avgTotalGoals: number;
  over2_5Rate: number;
  bothTeamsScoreRate: number;
}

function calculateH2HStats(matches: MatchRecord[], team1Name: string): H2HStats {
  const stats: H2HStats = {
    totalMatches: 0,
    team1Wins: 0,
    team2Wins: 0,
    draws: 0,
    avgTotalGoals: 0,
    over2_5Rate: 0,
    bothTeamsScoreRate: 0
  };

  const validMatches = matches.filter(m => m.homeGoals !== null && m.awayGoals !== null);
  if (validMatches.length === 0) return stats;

  stats.totalMatches = validMatches.length;
  let totalGoals = 0;
  let over2_5Count = 0;
  let btsCount = 0;
  const searchName = translateTeamName(team1Name);

  for (const match of validMatches) {
    const hg = match.homeGoals!;
    const ag = match.awayGoals!;
    totalGoals += hg + ag;

    if (hg + ag > 2.5) over2_5Count++;
    if (hg > 0 && ag > 0) btsCount++;

    const isTeam1Home = match.home.toLowerCase().includes(searchName.toLowerCase()) ||
                        searchName.toLowerCase().includes(match.home.toLowerCase().substring(0, 5));
    const team1Goals = isTeam1Home ? hg : ag;
    const team2Goals = isTeam1Home ? ag : hg;

    if (team1Goals > team2Goals) stats.team1Wins++;
    else if (team1Goals < team2Goals) stats.team2Wins++;
    else stats.draws++;
  }

  stats.avgTotalGoals = Math.round((totalGoals / stats.totalMatches) * 100) / 100;
  stats.over2_5Rate = Math.round((over2_5Count / stats.totalMatches) * 100) / 100;
  stats.bothTeamsScoreRate = Math.round((btsCount / stats.totalMatches) * 100) / 100;

  return stats;
}

// ============ 主逻辑 ============

export async function getTeamData(teamName: string): Promise<TeamData> {
  const result: TeamData = {};

  const teamId = await searchTeam(teamName);
  if (!teamId) {
    console.log(`[FootballData] Team not found: ${teamName}`);
    return result;
  }

  result.teamId = teamId;
  console.log(`[FootballData] Found team ${teamName} with ID ${teamId}`);

  // 获取近期 20 场比赛
  result.recentMatches = await getTeamFixtures(teamId, 20);

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

  // ===== 主队统计 =====
  if (homeData.recentMatches?.length) {
    const homeStats = calculateTeamStats(homeData.recentMatches, homeTeam);
    lines.push(`=== ${homeTeam} 近期数据统计（${homeStats.totalMatches} 场）===`);
    lines.push(`  胜率: ${(homeStats.winRate * 100).toFixed(0)}% (${homeStats.wins}胜 ${homeStats.draws}平 ${homeStats.losses}负)`);
    lines.push(`  场均进球: ${homeStats.avgGoalsFor} | 场均失球: ${homeStats.avgGoalsAgainst}`);
    lines.push(`  场均总进球: ${homeStats.avgTotalGoals} | 净胜球: ${homeStats.goalDifference > 0 ? '+' : ''}${homeStats.goalDifference}`);
    lines.push(`  大球率(>2.5): ${(homeStats.over2_5Rate * 100).toFixed(0)}% | 双方进球率: ${(homeStats.bothTeamsScoreRate * 100).toFixed(0)}%`);
    lines.push(`  近5场形式: ${homeStats.recentForm} (W=胜 D=平 L=负)`);
    if (homeStats.homeStats && homeStats.homeStats.matches > 0) {
      const h = homeStats.homeStats;
      lines.push(`  主场战绩: ${h.wins}胜 ${h.draws}平 ${h.losses}负 (${h.matches}场)`);
    }
    lines.push('');

    lines.push(`=== ${homeTeam} 近期比赛明细 ===`);
    for (const match of homeData.recentMatches.slice(0, 10)) {
      lines.push(`  ${match.date}: ${match.home} ${match.homeGoals ?? '?'}-${match.awayGoals ?? '?'} ${match.away} (${match.competition})`);
    }
    lines.push('');
  }

  // ===== 客队统计 =====
  if (awayData.recentMatches?.length) {
    const awayStats = calculateTeamStats(awayData.recentMatches, awayTeam);
    lines.push(`=== ${awayTeam} 近期数据统计（${awayStats.totalMatches} 场）===`);
    lines.push(`  胜率: ${(awayStats.winRate * 100).toFixed(0)}% (${awayStats.wins}胜 ${awayStats.draws}平 ${awayStats.losses}负)`);
    lines.push(`  场均进球: ${awayStats.avgGoalsFor} | 场均失球: ${awayStats.avgGoalsAgainst}`);
    lines.push(`  场均总进球: ${awayStats.avgTotalGoals} | 净胜球: ${awayStats.goalDifference > 0 ? '+' : ''}${awayStats.goalDifference}`);
    lines.push(`  大球率(>2.5): ${(awayStats.over2_5Rate * 100).toFixed(0)}% | 双方进球率: ${(awayStats.bothTeamsScoreRate * 100).toFixed(0)}%`);
    lines.push(`  近5场形式: ${awayStats.recentForm} (W=胜 D=平 L=负)`);
    if (awayStats.awayStats && awayStats.awayStats.matches > 0) {
      const a = awayStats.awayStats;
      lines.push(`  客场战绩: ${a.wins}胜 ${a.draws}平 ${a.losses}负 (${a.matches}场)`);
    }
    lines.push('');

    lines.push(`=== ${awayTeam} 近期比赛明细 ===`);
    for (const match of awayData.recentMatches.slice(0, 10)) {
      lines.push(`  ${match.date}: ${match.home} ${match.homeGoals ?? '?'}-${match.awayGoals ?? '?'} ${match.away} (${match.competition})`);
    }
    lines.push('');
  }

  // ===== 历史交锋统计 =====
  if (headToHead.length) {
    const h2hStats = calculateH2HStats(headToHead, homeTeam);
    lines.push(`=== 历史交锋统计（${h2hStats.totalMatches} 场）===`);
    lines.push(`  ${homeTeam} 赢: ${h2hStats.team1Wins}次 | ${awayTeam} 赢: ${h2hStats.team2Wins}次 | 平局: ${h2hStats.draws}次`);
    lines.push(`  场均总进球: ${h2hStats.avgTotalGoals} | 大球率: ${(h2hStats.over2_5Rate * 100).toFixed(0)}% | 双方进球率: ${(h2hStats.bothTeamsScoreRate * 100).toFixed(0)}%`);
    lines.push('');

    lines.push(`=== 历史交锋明细 ===`);
    for (const match of headToHead.slice(0, 10)) {
      lines.push(`  ${match.date}: ${match.home} ${match.homeGoals ?? '?'}-${match.awayGoals ?? '?'} ${match.away} (${match.competition})`);
    }
    lines.push('');
  }

  // ===== 主队伤病 =====
  if (homeData.injuries?.length) {
    lines.push(`=== ${homeTeam} 伤病情况 ===`);
    for (const injury of homeData.injuries.slice(0, 8)) {
      lines.push(`  - ${injury.player}: ${injury.reason} (${injury.date})`);
    }
    lines.push('');
  }

  // ===== 客队伤病 =====
  if (awayData.injuries?.length) {
    lines.push(`=== ${awayTeam} 伤病情况 ===`);
    for (const injury of awayData.injuries.slice(0, 8)) {
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
