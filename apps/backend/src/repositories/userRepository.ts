import { DEFAULT_CREDITS } from '../constants';
import type { UserRecord } from '../models/user';

const usersById = new Map<string, UserRecord>();
const usersByPhone = new Map<string, UserRecord>();

export function createUser(user: Omit<UserRecord, 'remainingCredits'>): UserRecord {
  const record: UserRecord = { ...user, remainingCredits: DEFAULT_CREDITS };
  usersById.set(record.id, record);
  usersByPhone.set(record.phone, record);
  return record;
}

export function findUserByPhone(phone: string): UserRecord | undefined {
  return usersByPhone.get(phone);
}

export function findUserById(userId: string): UserRecord | undefined {
  return usersById.get(userId);
}

export function updateUserCredits(userId: string, remainingCredits: number): UserRecord | undefined {
  const user = usersById.get(userId);
  if (!user) {
    return undefined;
  }
  const updated = { ...user, remainingCredits };
  usersById.set(userId, updated);
  usersByPhone.set(updated.phone, updated);
  return updated;
}
