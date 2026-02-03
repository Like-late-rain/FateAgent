import { randomUUID } from 'crypto';
import type { UserRecord } from '../models/types';

const users = new Map<string, UserRecord>();

export const userRepository = {
  async findByPhone(phone: string): Promise<UserRecord | null> {
    for (const user of users.values()) {
      if (user.phone === phone) {
        return { ...user };
      }
    }
    return null;
  },
  async findById(id: string): Promise<UserRecord | null> {
    const user = users.get(id);
    return user ? { ...user } : null;
  },
  async create(data: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const user: UserRecord = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    users.set(user.id, user);
    return { ...user };
  },
  async update(id: string, updates: Partial<UserRecord>) {
    const user = users.get(id);
    if (!user) {
      return null;
    }
    const updated: UserRecord = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    users.set(id, updated);
    return { ...updated };
  }
};
