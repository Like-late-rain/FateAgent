import type { AnalysisFactor, AnalysisRequest } from '@fateagent/shared-types';

export interface AnalysisRecord {
  id: string;
  userId: string;
  matchInfo: AnalysisRequest;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    prediction: '主胜' | '平局' | '客胜';
    confidence: number;
    analysis: string;
    factors: AnalysisFactor[];
  };
  disclaimer: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}
