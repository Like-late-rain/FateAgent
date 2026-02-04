import type { UserInfo } from '@fateagent/shared-types';
import { userRepository } from '../repositories/userRepository';
import type { UserRecord } from '../models/types';
import { ApiError } from '../utils/errors';

function toUserInfo(user: UserRecord): UserInfo {
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    remainingCredits: user.remainingCredits,
    createdAt: user.createdAt
  };
}

export const userService = {
  toUserInfo,
  async getUserById(userId: string): Promise<UserRecord> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('用户不存在', 404, 'UNAUTHORIZED');
    }
    return user;
  },
  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.getUserById(userId);
    return toUserInfo(user);
  },
  async getCredits(userId: string) {
    const user = await this.getUserById(userId);
    return { remainingCredits: user.remainingCredits };
  },
  async addCredits(userId: string, amount: number) {
    const user = await this.getUserById(userId);
    const updated = await userRepository.update(user.id, {
      remainingCredits: user.remainingCredits + amount
    });
    if (!updated) {
      throw new ApiError('更新失败', 500, 'UNKNOWN');
    }
    return updated;
  },
  async consumeCredits(userId: string, amount: number) {
    const user = await this.getUserById(userId);
    if (user.remainingCredits < amount) {
      throw new ApiError('次数不足', 403, 'INSUFFICIENT_CREDITS');
    }
    const updated = await userRepository.update(user.id, {
      remainingCredits: user.remainingCredits - amount
    });
    if (!updated) {
      throw new ApiError('扣减失败', 500, 'UNKNOWN');
    }
    return updated;
  }
};
