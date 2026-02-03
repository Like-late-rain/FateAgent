export interface UserRecord {
  id: string;
  phone: string;
  passwordHash: string;
  nickname?: string;
  remainingCredits: number;
  createdAt: string;
}
