export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_PHONE: 'DUPLICATE_PHONE',
  NOT_FOUND: 'NOT_FOUND',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const COOKIE_NAME = 'fateagent_token';
export const DEFAULT_CREDITS = 0;
export const CREDIT_DEDUCT_AMOUNT = 1;
export const ORDER_STATUS = {
  pending: 'pending',
  paid: 'paid',
  failed: 'failed',
  refunded: 'refunded',
} as const;

export const ANALYSIS_STATUS = {
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
} as const;

export const AGENT_TIMEOUT_MS = 60_000;
export const AGENT_RETRY_COUNT = 3;
export const USER_NICKNAME_PREFIX = '用户';
export const DEFAULT_DISCLAIMER = `本分析内容基于公开数据和统计模型生成，仅供娱乐与学习参考。
- 不构成任何投注、投资或实际决策建议
- 不保证预测结果的准确性
- 用户应自行承担使用本服务的一切风险

本服务不鼓励任何形式的赌博行为。`;
export const ERROR_MESSAGES = {
  duplicatePhone: '手机号已存在',
  invalidCredentials: '账号或密码错误',
  userNotFound: '用户不存在',
  unauthorized: '未登录或登录已失效',
  unauthorizedShort: '未登录',
  internalError: '系统错误',
  orderNotFound: '订单不存在',
  insufficientCredits: '剩余次数不足',
  analysisNotFound: '分析记录不存在',
} as const;
