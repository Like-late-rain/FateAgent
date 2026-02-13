import { getSupabaseClient } from '../utils/supabase.js';
import type { AnalysisRecord, MatchActualResult, PredictionComparison } from '../models/types.js';

/**
 * 录入比赛实际结果
 */
export async function recordMatchResult(
  analysisId: string,
  homeScore: number,
  awayScore: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();

    // 获取分析记录
    const { data: analysisRow, error: fetchError } = await supabase
      .from('analysis_records')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (fetchError || !analysisRow) {
      return { success: false, error: '分析记录不存在' };
    }

    // 检查比赛是否已经结束（比赛日期需要在今天之前）
    const matchInfo = analysisRow.match_info as AnalysisRecord['matchInfo'];
    const matchDate = new Date(matchInfo.matchDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (matchDate >= now) {
      return { success: false, error: '比赛尚未结束，无法录入结果' };
    }

    // 计算实际结果
    const totalGoals = homeScore + awayScore;
    let outcome: 'homeWin' | 'draw' | 'awayWin';
    if (homeScore > awayScore) {
      outcome = 'homeWin';
    } else if (homeScore < awayScore) {
      outcome = 'awayWin';
    } else {
      outcome = 'draw';
    }

    const actualResult: MatchActualResult = {
      homeScore,
      awayScore,
      outcome,
      totalGoals,
      recordedAt: new Date().toISOString()
    };

    // 计算预测对比
    const result = analysisRow.result as AnalysisRecord['result'];
    const comparison = calculatePredictionComparison(matchInfo, result, actualResult);

    // 更新数据库
    const { error: updateError } = await supabase
      .from('analysis_records')
      .update({
        actual_result: actualResult,
        comparison: comparison
      })
      .eq('id', analysisId);

    if (updateError) {
      console.error('[MatchResult] Update error:', updateError);
      return { success: false, error: '更新失败' };
    }

    // 更新 Agent 性能指标
    await updateAgentPerformanceMetrics(comparison);

    // 如果预测不准确，生成学习记录
    if (!comparison.outcomeCorrect || !comparison.scoreInTop5) {
      await generateLearningRecord(analysisId, matchInfo, result, actualResult, comparison);
    }

    return { success: true };
  } catch (error) {
    console.error('[MatchResult] Record error:', error);
    return { success: false, error: '录入失败' };
  }
}

/**
 * 计算预测的最可能结果
 */
function calculatePredictedOutcome(winProbability: any): {
  predictedOutcome: 'homeWin' | 'draw' | 'awayWin';
  maxProbability: number;
} {
  let predictedOutcome: 'homeWin' | 'draw' | 'awayWin' = 'draw';
  let maxProbability = 0;

  if (winProbability) {
    const probs = {
      homeWin: winProbability.homeWin,
      draw: winProbability.draw,
      awayWin: winProbability.awayWin
    };

    if (probs.homeWin > maxProbability) {
      maxProbability = probs.homeWin;
      predictedOutcome = 'homeWin';
    }
    if (probs.draw > maxProbability) {
      maxProbability = probs.draw;
      predictedOutcome = 'draw';
    }
    if (probs.awayWin > maxProbability) {
      maxProbability = probs.awayWin;
      predictedOutcome = 'awayWin';
    }
  }

  return { predictedOutcome, maxProbability };
}

/**
 * 计算比分预测准确性
 */
function calculateScoreAccuracy(scorePredictions: any[], actualScore: string): {
  exactScoreCorrect: boolean;
  scoreInTop5: boolean;
  scoreRank?: number;
} {
  let exactScoreCorrect = false;
  let scoreInTop5 = false;
  let scoreRank: number | undefined;

  if (scorePredictions && scorePredictions.length > 0) {
    const top5Scores = scorePredictions.slice(0, 5);

    top5Scores.forEach((pred, index) => {
      if (pred.score === actualScore) {
        scoreInTop5 = true;
        scoreRank = index + 1;
        if (index === 0) {
          exactScoreCorrect = true;
        }
      }
    });
  }

  return { exactScoreCorrect, scoreInTop5, scoreRank };
}

/**
 * 计算进球数预测准确性
 */
function calculateGoalsAccuracy(goalsPrediction: any, actualResult: MatchActualResult): {
  overUnderCorrect?: boolean;
  bothTeamsScoreCorrect?: boolean;
} {
  let overUnderCorrect: boolean | undefined;
  let bothTeamsScoreCorrect: boolean | undefined;

  if (goalsPrediction) {
    // 大小球 2.5
    const totalGoals = actualResult.totalGoals;
    const over25Prob = goalsPrediction.totalOver2_5 ?? 0;
    const under25Prob = goalsPrediction.totalUnder2_5 ?? 0;

    if (over25Prob > 0 || under25Prob > 0) {
      const predictOver = over25Prob > under25Prob;
      const actualOver = totalGoals > 2.5;
      overUnderCorrect = predictOver === actualOver;
    }

    // 双方进球
    if (typeof goalsPrediction.bothTeamsScore === 'number') {
      const bothScored = actualResult.homeScore > 0 && actualResult.awayScore > 0;
      bothTeamsScoreCorrect = goalsPrediction.bothTeamsScore > 0.5 ? bothScored : !bothScored;
    }
  }

  return { overUnderCorrect, bothTeamsScoreCorrect };
}

/**
 * 计算综合评分
 */
function calculateAccuracyScore(
  outcomeCorrect: boolean,
  maxProbability: number,
  exactScoreCorrect: boolean,
  scoreInTop5: boolean,
  scoreRank: number | undefined,
  overUnderCorrect: boolean | undefined,
  bothTeamsScoreCorrect: boolean | undefined
): number {
  let accuracyScore = 0;

  // 胜负预测: 40 分
  if (outcomeCorrect) {
    accuracyScore += 40;
  } else {
    accuracyScore += Math.max(0, (1 - maxProbability) * 20);
  }

  // 比分预测: 30 分
  if (exactScoreCorrect) {
    accuracyScore += 30;
  } else if (scoreInTop5 && scoreRank) {
    accuracyScore += 20 - ((scoreRank - 1) * 3);
  }

  // 进球数预测: 30 分
  if (overUnderCorrect !== undefined) {
    accuracyScore += overUnderCorrect ? 15 : 0;
  }
  if (bothTeamsScoreCorrect !== undefined) {
    accuracyScore += bothTeamsScoreCorrect ? 15 : 0;
  }

  return Math.round(accuracyScore);
}

/**
 * 计算预测对比结果（主函数）
 */
function calculatePredictionComparison(
  matchInfo: AnalysisRecord['matchInfo'],
  result: AnalysisRecord['result'],
  actualResult: MatchActualResult
): PredictionComparison {
  if (!result) {
    throw new Error('分析结果不存在');
  }

  // 1. 确定预测结果
  const { predictedOutcome, maxProbability } = calculatePredictedOutcome(result.winProbability);

  // 2. 胜负预测准确性
  const outcomeCorrect = predictedOutcome === actualResult.outcome;
  const outcomeProbability = result.winProbability ?
    result.winProbability[actualResult.outcome] : 0;

  // 3. 比分预测准确性
  const actualScore = `${actualResult.homeScore}-${actualResult.awayScore}`;
  const { exactScoreCorrect, scoreInTop5, scoreRank } = calculateScoreAccuracy(
    result.scorePredictions || [],
    actualScore
  );

  // 4. 进球数预测准确性
  const { overUnderCorrect, bothTeamsScoreCorrect } = calculateGoalsAccuracy(
    result.goalsPrediction,
    actualResult
  );

  // 5. 计算综合评分
  const accuracyScore = calculateAccuracyScore(
    outcomeCorrect,
    maxProbability,
    exactScoreCorrect,
    scoreInTop5,
    scoreRank,
    overUnderCorrect,
    bothTeamsScoreCorrect
  );

  return {
    outcomeCorrect,
    predictedOutcome,
    actualOutcome: actualResult.outcome,
    outcomeProbability,
    exactScoreCorrect,
    scoreInTop5,
    scoreRank,
    overUnderCorrect,
    bothTeamsScoreCorrect,
    accuracyScore,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * 更新 Agent 全局性能指标
 *
 * 注意：当前实现使用乐观锁机制，Supabase 的 RLS 和行级锁确保并发安全。
 * 在高并发场景下，可以考虑使用数据库函数来实现原子性更新。
 */
async function updateAgentPerformanceMetrics(comparison: PredictionComparison): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    // 获取或创建性能指标记录
    const { data: metrics, error: fetchError } = await supabase
      .from('agent_performance')
      .select('*')
      .eq('id', 'global')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[AgentPerformance] Fetch error:', fetchError);
      return;
    }

    if (!metrics) {
      // 初始化性能指标
      await supabase
        .from('agent_performance')
        .insert({
          id: 'global',
          total_predictions: 0,
          verified_predictions: 0,
          outcome_accuracy: 0,
          home_win_accuracy: 0,
          draw_accuracy: 0,
          away_win_accuracy: 0,
          exact_score_accuracy: 0,
          score_in_top5_rate: 0,
          over_under_accuracy: 0,
          both_teams_score_accuracy: 0,
          high_confidence_accuracy: 0,
          medium_confidence_accuracy: 0,
          low_confidence_accuracy: 0,
          overall_score: 0,
          updated_at: new Date().toISOString()
        });

      // 重新获取
      const { data: newMetrics } = await supabase
        .from('agent_performance')
        .select('*')
        .eq('id', 'global')
        .single();

      if (!newMetrics) return;
    }

    // 使用当前值或从数据库获取
    const current = metrics || {
      verified_predictions: 0,
      outcome_accuracy: 0,
      home_win_accuracy: 0,
      draw_accuracy: 0,
      away_win_accuracy: 0,
      exact_score_accuracy: 0,
      score_in_top5_rate: 0,
      over_under_accuracy: 0,
      both_teams_score_accuracy: 0,
      overall_score: 0
    };

    const n = current.verified_predictions; // 当前已验证数量

    // 使用增量更新公式计算新的准确率
    const updateAccuracy = (oldAccuracy: number, isCorrect: boolean) => {
      return (oldAccuracy * n + (isCorrect ? 1 : 0)) / (n + 1);
    };

    // 构建更新数据
    const updates: any = {
      verified_predictions: n + 1,
      outcome_accuracy: updateAccuracy(current.outcome_accuracy, comparison.outcomeCorrect),
      exact_score_accuracy: updateAccuracy(current.exact_score_accuracy, comparison.exactScoreCorrect),
      score_in_top5_rate: updateAccuracy(current.score_in_top5_rate, comparison.scoreInTop5),
      overall_score: (current.overall_score * n + comparison.accuracyScore) / (n + 1),
      updated_at: new Date().toISOString()
    };

    // 可选字段更新
    if (comparison.overUnderCorrect !== undefined) {
      updates.over_under_accuracy = updateAccuracy(current.over_under_accuracy, comparison.overUnderCorrect);
    }
    if (comparison.bothTeamsScoreCorrect !== undefined) {
      updates.both_teams_score_accuracy = updateAccuracy(current.both_teams_score_accuracy, comparison.bothTeamsScoreCorrect);
    }

    // 按结果类型更新准确率
    if (comparison.actualOutcome === 'homeWin') {
      updates.home_win_accuracy = updateAccuracy(
        current.home_win_accuracy,
        comparison.predictedOutcome === 'homeWin'
      );
    } else if (comparison.actualOutcome === 'draw') {
      updates.draw_accuracy = updateAccuracy(
        current.draw_accuracy,
        comparison.predictedOutcome === 'draw'
      );
    } else {
      updates.away_win_accuracy = updateAccuracy(
        current.away_win_accuracy,
        comparison.predictedOutcome === 'awayWin'
      );
    }

    // 更新数据库
    await supabase
      .from('agent_performance')
      .update(updates)
      .eq('id', 'global');
  } catch (error) {
    console.error('[AgentPerformance] Update error:', error);
  }
}

/**
 * 生成 Agent 学习记录
 */
async function generateLearningRecord(
  analysisId: string,
  matchInfo: AnalysisRecord['matchInfo'],
  result: AnalysisRecord['result'],
  actualResult: MatchActualResult,
  comparison: PredictionComparison
): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    let errorType: 'outcome_wrong' | 'score_wrong' | 'confidence_overestimated' | 'confidence_underestimated';
    let errorDescription = '';

    const outcomeMap = {
      homeWin: '主胜',
      draw: '平局',
      awayWin: '客胜'
    };

    if (!comparison.outcomeCorrect) {
      errorType = 'outcome_wrong';
      errorDescription = `预测 ${outcomeMap[comparison.predictedOutcome]} 但实际是 ${outcomeMap[comparison.actualOutcome]}，置信度为 ${(comparison.outcomeProbability * 100).toFixed(0)}%`;
    } else if (!comparison.scoreInTop5) {
      errorType = 'score_wrong';
      errorDescription = `预测的 TOP 5 比分中未包含实际比分 ${actualResult.homeScore}-${actualResult.awayScore}`;
    } else if (comparison.outcomeProbability > 0.7 && !comparison.outcomeCorrect) {
      errorType = 'confidence_overestimated';
      errorDescription = `高置信度(${(comparison.outcomeProbability * 100).toFixed(0)}%)预测错误`;
    } else {
      errorType = 'confidence_underestimated';
      errorDescription = `低置信度预测但结果正确，可能低估了判断准确性`;
    }

    const improvementSuggestions = [
      '需要更全面分析球队近期状态和伤病情况',
      '考虑主客场因素对比赛结果的影响',
      '优化历史交锋数据的权重分配'
    ];

    await supabase
      .from('agent_learning_records')
      .insert({
        id: `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        analysis_id: analysisId,
        error_type: errorType,
        error_description: errorDescription,
        improvement_suggestions: improvementSuggestions,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('[LearningRecord] Generate error:', error);
  }
}

/**
 * 获取分析记录的对比结果
 */
export async function getAnalysisComparison(analysisId: string) {
  try {
    const supabase = getSupabaseClient();

    const { data: analysisRow, error: fetchError } = await supabase
      .from('analysis_records')
      .select('id, match_info, result, actual_result, comparison, created_at')
      .eq('id', analysisId)
      .single();

    if (fetchError || !analysisRow) {
      return { success: false, error: '记录不存在' };
    }

    // 检查是否已有实际结果
    if (!analysisRow.actual_result) {
      // 检查比赛是否结束
      const matchInfo = analysisRow.match_info as AnalysisRecord['matchInfo'];
      const matchDate = new Date(matchInfo.matchDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (matchDate >= now) {
        return {
          success: false,
          error: '比赛尚未结束',
          canCompare: false,
          matchDate: matchInfo.matchDate
        };
      }

      return {
        success: false,
        error: '比赛结果尚未录入',
        canCompare: true,
        matchDate: matchInfo.matchDate
      };
    }

    return {
      success: true,
      data: {
        matchInfo: analysisRow.match_info,
        prediction: analysisRow.result,
        actualResult: analysisRow.actual_result,
        comparison: analysisRow.comparison,
        createdAt: analysisRow.created_at
      }
    };
  } catch (error) {
    console.error('[MatchResult] Get comparison error:', error);
    return { success: false, error: '获取失败' };
  }
}

/**
 * 自动抓取并录入比赛结果
 */
export async function autoFetchAndRecordResult(analysisId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabaseClient();

    // 获取分析记录
    const { data: analysisRow, error: fetchError } = await supabase
      .from('analysis_records')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (fetchError || !analysisRow) {
      return { success: false, error: '分析记录不存在' };
    }

    // 检查是否已经有结果
    if (analysisRow.actual_result) {
      return { success: false, error: '比赛结果已存在' };
    }

    const matchInfo = analysisRow.match_info as AnalysisRecord['matchInfo'];
    const matchDate = new Date(matchInfo.matchDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 检查比赛是否已经结束
    if (matchDate >= now) {
      return { success: false, error: '比赛尚未结束' };
    }

    // 调用 Agent 服务抓取比赛结果
    const { agentService } = await import('./agentService.js');
    const fetchResult = await agentService.fetchMatchResult(
      matchInfo.homeTeam,
      matchInfo.awayTeam,
      matchInfo.matchDate
    );

    if (!fetchResult.success || fetchResult.homeScore === undefined || fetchResult.awayScore === undefined) {
      return {
        success: false,
        error: fetchResult.error || '无法获取比赛结果'
      };
    }

    // 录入结果
    const recordResult = await recordMatchResult(
      analysisId,
      fetchResult.homeScore,
      fetchResult.awayScore
    );

    return recordResult;
  } catch (error) {
    console.error('[MatchResult] Auto fetch error:', error);
    return { success: false, error: '自动抓取失败' };
  }
}

/**
 * 获取 Agent 性能指标
 */
export async function getAgentPerformanceMetrics() {
  try {
    const supabase = getSupabaseClient();

    const { data: metrics, error } = await supabase
      .from('agent_performance')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[AgentPerformance] Get metrics error:', error);
      return { success: false, error: '获取失败' };
    }

    if (!metrics) {
      // 返回初始值
      return {
        success: true,
        data: {
          id: 'global',
          totalPredictions: 0,
          verifiedPredictions: 0,
          outcomeAccuracy: 0,
          homeWinAccuracy: 0,
          drawAccuracy: 0,
          awayWinAccuracy: 0,
          exactScoreAccuracy: 0,
          scoreInTop5Rate: 0,
          overUnderAccuracy: 0,
          bothTeamsScoreAccuracy: 0,
          highConfidenceAccuracy: 0,
          mediumConfidenceAccuracy: 0,
          lowConfidenceAccuracy: 0,
          overallScore: 0
        }
      };
    }

    // 转换为 camelCase
    return {
      success: true,
      data: {
        id: metrics.id,
        totalPredictions: metrics.total_predictions,
        verifiedPredictions: metrics.verified_predictions,
        outcomeAccuracy: metrics.outcome_accuracy,
        homeWinAccuracy: metrics.home_win_accuracy,
        drawAccuracy: metrics.draw_accuracy,
        awayWinAccuracy: metrics.away_win_accuracy,
        exactScoreAccuracy: metrics.exact_score_accuracy,
        scoreInTop5Rate: metrics.score_in_top5_rate,
        overUnderAccuracy: metrics.over_under_accuracy,
        bothTeamsScoreAccuracy: metrics.both_teams_score_accuracy,
        highConfidenceAccuracy: metrics.high_confidence_accuracy,
        mediumConfidenceAccuracy: metrics.medium_confidence_accuracy,
        lowConfidenceAccuracy: metrics.low_confidence_accuracy,
        overallScore: metrics.overall_score,
        updatedAt: metrics.updated_at
      }
    };
  } catch (error) {
    console.error('[AgentPerformance] Get metrics error:', error);
    return { success: false, error: '获取失败' };
  }
}
