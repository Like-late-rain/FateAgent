import type { AnalysisResult, ProductType } from '@fateagent/shared-types';

export interface UserRecord {
  id: string;
  phone: string;
  passwordHash: string;
  nickname?: string;
  remainingCredits: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  id: string;
  orderNo: string;
  userId: string;
  productType: ProductType;
  creditsAmount: number;
  priceCents: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  matchInfo: AnalysisResult['matchInfo'];
  result?: AnalysisResult['result'];
  disclaimer: string;
  createdAt: string;
  completedAt?: string;
  creditDeducted: boolean;
  errorMessage?: string;
  // 比赛实际结果
  actualResult?: MatchActualResult;
  // 结果对比数据
  comparison?: PredictionComparison;
}

// 比赛实际结果
export interface MatchActualResult {
  homeScore: number;
  awayScore: number;
  outcome: 'homeWin' | 'draw' | 'awayWin'; // 实际胜负结果
  totalGoals: number;
  recordedAt: string; // 结果录入时间
}

// 预测对比结果
export interface PredictionComparison {
  // 胜负预测准确性
  outcomeCorrect: boolean; // 预测的最可能结果是否正确
  predictedOutcome: 'homeWin' | 'draw' | 'awayWin';
  actualOutcome: 'homeWin' | 'draw' | 'awayWin';
  outcomeProbability: number; // Agent 对正确结果预测的概率

  // 比分预测准确性
  exactScoreCorrect: boolean; // 比分是否完全正确
  scoreInTop5: boolean; // 实际比分是否在 TOP 5 预测中
  scoreRank?: number; // 实际比分在预测中的排名

  // 进球数预测准确性
  overUnderCorrect?: boolean; // 大小球预测是否正确
  bothTeamsScoreCorrect?: boolean; // 双方进球预测是否正确

  // 综合评分
  accuracyScore: number; // 0-100，综合准确率评分
  calculatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'consume' | 'refund';
  orderId?: string;
  description?: string;
  createdAt: string;
}

// Agent 性能指标（全局统计）
export interface AgentPerformanceMetrics {
  id: string;

  // 基础统计
  totalPredictions: number; // 总预测次数
  verifiedPredictions: number; // 已验证的预测次数（有实际结果的）

  // 胜负预测准确率
  outcomeAccuracy: number; // 胜负预测准确率 (0-1)
  homeWinAccuracy: number; // 主胜预测准确率
  drawAccuracy: number; // 平局预测准确率
  awayWinAccuracy: number; // 客胜预测准确率

  // 比分预测准确率
  exactScoreAccuracy: number; // 精确比分命中率
  scoreInTop5Rate: number; // 比分在 TOP 5 的命中率

  // 进球数预测准确率
  overUnderAccuracy: number; // 大小球准确率
  bothTeamsScoreAccuracy: number; // 双方进球准确率

  // 置信度分析
  highConfidenceAccuracy: number; // 高置信度(>70%)预测的准确率
  mediumConfidenceAccuracy: number; // 中置信度(40-70%)预测的准确率
  lowConfidenceAccuracy: number; // 低置信度(<40%)预测的准确率

  // 综合评分
  overallScore: number; // 综合评分 (0-100)

  // 时间戳
  updatedAt: string;
}

// Agent 学习记录（反思和改进）
export interface AgentLearningRecord {
  id: string;
  analysisId: string; // 关联的分析记录

  // 错误分析
  errorType: 'outcome_wrong' | 'score_wrong' | 'confidence_overestimated' | 'confidence_underestimated';
  errorDescription: string; // AI 生成的错误分析

  // 改进建议
  improvementSuggestions: string[]; // AI 生成的改进建议

  // 关键因素分析
  misjudgedFactors?: string[]; // 误判的关键因素
  missedFactors?: string[]; // 遗漏的关键因素

  createdAt: string;
}
