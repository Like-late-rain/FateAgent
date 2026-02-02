import type {
  AnalysisResult,
  ApiResponse,
  AuthResponse,
  CreateOrderRequest,
  LoginRequest,
  OrderInfo,
  PaginatedResponse,
  RegisterRequest,
  UserInfo,
} from '@fateagent/shared-types';
import { DEFAULT_DISCLAIMER } from '@/utils/constants';

const DEFAULT_MOCK_CREDITS = 5;

const MOCK_USER: UserInfo = {
  id: 'user_mock_001',
  phone: '13800000000',
  nickname: 'FateAgent 用户',
  remainingCredits: DEFAULT_MOCK_CREDITS,
  createdAt: new Date().toISOString(),
};

let currentCredits = MOCK_USER.remainingCredits;

const PRODUCT_CREDITS: Record<CreateOrderRequest['productType'], number> = {
  credits_10: 10,
  credits_30: 30,
  credits_100: 100,
};

function buildResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function mockRegister(_payload: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  return Promise.resolve(buildResponse({ token: 'mock-token', user: MOCK_USER }));
}

export function mockLogin(_payload: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  return Promise.resolve(buildResponse({ token: 'mock-token', user: MOCK_USER }));
}

export function mockUserProfile(): Promise<ApiResponse<UserInfo>> {
  return Promise.resolve(buildResponse({ ...MOCK_USER, remainingCredits: currentCredits }));
}

export function mockCredits(): Promise<ApiResponse<{ remainingCredits: number }>> {
  return Promise.resolve(buildResponse({ remainingCredits: currentCredits }));
}

export function mockCreateOrder(
  payload: CreateOrderRequest,
): Promise<ApiResponse<OrderInfo>> {
  const credits = PRODUCT_CREDITS[payload.productType];
  currentCredits += credits;
  return Promise.resolve(
    buildResponse({
      id: 'order_mock_001',
      orderNo: 'ORDER-001',
      productType: payload.productType,
      creditsAmount: credits,
      priceCents: credits * 100,
      status: 'paid',
      createdAt: new Date().toISOString(),
    }),
  );
}

export function mockCreateAnalysis(): Promise<ApiResponse<AnalysisResult>> {
  if (currentCredits <= 0) {
    return Promise.resolve({
      success: false,
      error: { code: 'INSUFFICIENT_CREDITS', message: '次数不足' },
    });
  }
  currentCredits -= 1;
  return Promise.resolve(
    buildResponse({
      id: 'analysis_mock_001',
      status: 'completed',
      matchInfo: {
        homeTeam: '主队',
        awayTeam: '客队',
        competition: '友谊赛',
        matchDate: new Date().toISOString().split('T')[0] ?? '',
      },
      result: {
        prediction: '平局',
        confidence: 0.62,
        analysis: '双方近期状态接近，防守端稳定，预计比赛节奏偏慢。',
        factors: [
          { name: '近期状态', impact: 'neutral', description: '两队近五场表现接近。' },
          { name: '主场优势', impact: 'positive', description: '主队主场胜率略高。' },
        ],
      },
      disclaimer: DEFAULT_DISCLAIMER,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }),
  );
}

export function mockAnalysisHistory(): Promise<ApiResponse<PaginatedResponse<AnalysisResult>>> {
  return Promise.resolve(
    buildResponse({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      hasMore: false,
    }),
  );
}
