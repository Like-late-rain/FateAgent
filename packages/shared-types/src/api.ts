// ============ 用户认证 ============
export interface RegisterRequest {
  phone: string;
  password: string;
  smsCode?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  phone: string;
  nickname?: string;
  remainingCredits: number;
  createdAt: string;
}

// ============ 订单支付 ============
export type ProductType = 'credits_10' | 'credits_30' | 'credits_100';

export interface CreateOrderRequest {
  productType: ProductType;
}

export interface OrderInfo {
  id: string;
  orderNo: string;
  productType: ProductType;
  creditsAmount: number;
  priceCents: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  payUrl?: string;
}

// ============ 自然语言解析 ============
export interface ParseQueryRequest {
  query: string; // 用户输入的自然语言
}

export interface ParsedMatchInfo {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string; // YYYY-MM-DD
  confidence: number; // 解析置信度 0-1
  originalQuery: string;
}

export interface ParseQueryResponse {
  success: boolean;
  parsed?: ParsedMatchInfo;
  error?: string;
}

// ============ 分析服务 ============
export interface AnalysisRequest {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  matchDate: string; // YYYY-MM-DD
}

export interface AnalysisFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

// 胜平负概率
export interface WinProbability {
  homeWin: number; // 主胜概率 0-1
  draw: number; // 平局概率 0-1
  awayWin: number; // 客胜概率 0-1
}

// 比分概率
export interface ScoreProbability {
  score: string; // 如 "2-1"
  probability: number; // 0-1
}

// 进球预测
export interface GoalsPrediction {
  totalOver2_5: number; // 大2.5球概率
  totalUnder2_5: number; // 小2.5球概率
  bothTeamsScore: number; // 双方都进球概率
  homeGoalsExpected: number; // 主队预期进球
  awayGoalsExpected: number; // 客队预期进球
}

// 球队分析
export interface TeamAnalysis {
  name: string;
  form?: string; // 近期状态 如 "WWDLW"
  position?: number; // 联赛排名
  played?: number; // 已赛场次
  won?: number;
  draw?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  injuries?: string[]; // 伤病球员名单
  keyNews?: string[]; // 关键新闻
}

// 详细分析结果
export interface DetailedAnalysisResult {
  prediction: '主胜' | '平局' | '客胜';
  confidence: number; // 0-1
  analysis: string;
  factors: AnalysisFactor[];
  winProbability?: WinProbability;
  scorePredictions?: ScoreProbability[];
  goalsPrediction?: GoalsPrediction;
  homeTeamAnalysis?: TeamAnalysis;
  awayTeamAnalysis?: TeamAnalysis;
  headToHead?: string[]; // 历史交锋记录
  dataSources?: string[]; // 数据来源
}

export interface AnalysisResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  matchInfo: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
    matchDate: string;
  };
  result?: DetailedAnalysisResult;
  disclaimer: string;
  createdAt: string;
  completedAt?: string;
}

// ============ 通用响应 ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
