-- ============================================
-- 比赛结果录入和 Agent 性能追踪功能
-- 迁移脚本
-- ============================================

-- 1. 为 analysis_records 表添加新字段
ALTER TABLE analysis_records
ADD COLUMN IF NOT EXISTS actual_result JSONB,
ADD COLUMN IF NOT EXISTS comparison JSONB;

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_analysis_actual_result ON analysis_records(actual_result);
CREATE INDEX IF NOT EXISTS idx_analysis_comparison ON analysis_records(comparison);

-- 2. Agent 性能指标表
CREATE TABLE IF NOT EXISTS agent_performance (
  id VARCHAR(50) PRIMARY KEY, -- 使用 'global' 作为全局记录ID

  -- 基础统计
  total_predictions INT DEFAULT 0,
  verified_predictions INT DEFAULT 0, -- 已验证的预测（有实际结果的）

  -- 胜负预测准确率
  outcome_accuracy DECIMAL(5,4) DEFAULT 0, -- 总体胜负预测准确率
  home_win_accuracy DECIMAL(5,4) DEFAULT 0,
  draw_accuracy DECIMAL(5,4) DEFAULT 0,
  away_win_accuracy DECIMAL(5,4) DEFAULT 0,

  -- 比分预测准确率
  exact_score_accuracy DECIMAL(5,4) DEFAULT 0, -- 精确比分命中率
  score_in_top5_rate DECIMAL(5,4) DEFAULT 0, -- 比分在 TOP 5 的命中率

  -- 进球数预测准确率
  over_under_accuracy DECIMAL(5,4) DEFAULT 0, -- 大小球准确率
  both_teams_score_accuracy DECIMAL(5,4) DEFAULT 0, -- 双方进球准确率

  -- 置信度分析
  high_confidence_accuracy DECIMAL(5,4) DEFAULT 0, -- 高置信度(>70%)预测的准确率
  medium_confidence_accuracy DECIMAL(5,4) DEFAULT 0, -- 中置信度(40-70%)
  low_confidence_accuracy DECIMAL(5,4) DEFAULT 0, -- 低置信度(<40%)

  -- 综合评分
  overall_score DECIMAL(5,2) DEFAULT 0, -- 综合评分 (0-100)

  -- 时间戳
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初始化全局性能记录
INSERT INTO agent_performance (id, updated_at)
VALUES ('global', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Agent 学习记录表
CREATE TABLE IF NOT EXISTS agent_learning_records (
  id VARCHAR(100) PRIMARY KEY,
  analysis_id UUID REFERENCES analysis_records(id) ON DELETE CASCADE,

  -- 错误分析
  error_type VARCHAR(50) NOT NULL, -- outcome_wrong, score_wrong, confidence_overestimated, confidence_underestimated
  error_description TEXT NOT NULL,

  -- 改进建议
  improvement_suggestions JSONB, -- 数组形式

  -- 关键因素分析
  misjudged_factors JSONB, -- 误判的关键因素
  missed_factors JSONB, -- 遗漏的关键因素

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_learning_analysis_id ON agent_learning_records(analysis_id);
CREATE INDEX IF NOT EXISTS idx_learning_error_type ON agent_learning_records(error_type);
CREATE INDEX IF NOT EXISTS idx_learning_created_at ON agent_learning_records(created_at DESC);

-- 4. 添加注释
COMMENT ON TABLE agent_performance IS 'Agent 预测性能指标（全局统计）';
COMMENT ON TABLE agent_learning_records IS 'Agent 学习记录（错误分析和改进建议）';
COMMENT ON COLUMN analysis_records.actual_result IS '比赛实际结果 JSON: {homeScore, awayScore, outcome, totalGoals, recordedAt}';
COMMENT ON COLUMN analysis_records.comparison IS '预测对比结果 JSON: {outcomeCorrect, predictedOutcome, actualOutcome, ...}';
