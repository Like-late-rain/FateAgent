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

export interface AnalysisResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  matchInfo: {
    homeTeam: string;
    awayTeam: string;
    competition: string;
    matchDate: string;
  };
  result?: {
    prediction: '主胜' | '平局' | '客胜';
    confidence: number; // 0-1
    analysis: string;
    factors: AnalysisFactor[];
  };
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
