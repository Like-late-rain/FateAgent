import { randomUUID } from 'crypto';
import type { AnalysisRecord } from '../models/types';

const analyses = new Map<string, AnalysisRecord>();

export const analysisRepository = {
  async create(data: Omit<AnalysisRecord, 'id' | 'createdAt'>) {
    const record: AnalysisRecord = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    };
    analyses.set(record.id, record);
    return { ...record };
  },
  async findById(id: string): Promise<AnalysisRecord | null> {
    const record = analyses.get(id);
    return record ? { ...record } : null;
  },
  async listByUser(userId: string) {
    return Array.from(analyses.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((record) => ({ ...record }));
  },
  async update(id: string, updates: Partial<AnalysisRecord>) {
    const record = analyses.get(id);
    if (!record) {
      return null;
    }
    const updated: AnalysisRecord = {
      ...record,
      ...updates
    };
    analyses.set(id, updated);
    return { ...updated };
  }
};
