import type { AnalysisRecord } from '../models/analysis';

const analyses = new Map<string, AnalysisRecord>();

export function createAnalysis(record: AnalysisRecord): AnalysisRecord {
  analyses.set(record.id, record);
  return record;
}

export function findAnalysisById(analysisId: string): AnalysisRecord | undefined {
  return analyses.get(analysisId);
}

export function updateAnalysis(record: AnalysisRecord): AnalysisRecord {
  analyses.set(record.id, record);
  return record;
}

export function listAnalysesByUser(userId: string): AnalysisRecord[] {
  return Array.from(analyses.values())
    .filter((analysis) => analysis.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
