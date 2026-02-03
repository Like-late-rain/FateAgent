import { randomUUID } from 'crypto';
import type { CreditTransaction } from '../models/types';

const transactions: CreditTransaction[] = [];

export const creditTransactionRepository = {
  async create(data: Omit<CreditTransaction, 'id' | 'createdAt'>) {
    const record: CreditTransaction = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    };
    transactions.push(record);
    return { ...record };
  },
  async listByUser(userId: string) {
    return transactions
      .filter((record) => record.userId === userId)
      .map((record) => ({ ...record }));
  }
};
