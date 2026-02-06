export interface AnalysisPayload {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string;
}

export interface ParseResult {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string;
  confidence: number;
  originalQuery: string;
}

export interface AnalysisFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface WinProbability {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export interface ScoreProbability {
  score: string;
  probability: number;
}

export interface GoalsPrediction {
  totalOver2_5: number;
  totalUnder2_5: number;
  bothTeamsScore: number;
  homeGoalsExpected: number;
  awayGoalsExpected: number;
}

export interface AnalysisResult {
  prediction: '主胜' | '平局' | '客胜';
  confidence: number;
  analysis: string;
  factors: AnalysisFactor[];
  winProbability?: WinProbability;
  scorePredictions?: ScoreProbability[];
  goalsPrediction?: GoalsPrediction;
}

export interface TeamData {
  teamId?: number;
  recentMatches?: MatchRecord[];
  worldCupHistory?: MatchRecord[];
  injuries?: InjuryInfo[];
}

export interface MatchRecord {
  date: string;
  competition?: string;
  round?: string;
  home: string;
  away: string;
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface InjuryInfo {
  player: string;
  reason: string;
  date: string;
}
