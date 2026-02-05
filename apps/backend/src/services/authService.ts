import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@fateagent/shared-types';
import { userRepository } from '../repositories/userRepository';
import { ApiError } from '../utils/errors';
import { userService } from './userService';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError('JWT 未配置', 500, 'UNKNOWN');
  }
  return secret;
}

function signToken(userId: string) {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ sub: userId }, secret, { expiresIn } as jwt.SignOptions);
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existing = await userRepository.findByPhone(data.phone);
    if (existing) {
      throw new ApiError('手机号已注册', 409, 'UNKNOWN');
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      phone: data.phone,
      passwordHash,
      nickname: `用户${data.phone.slice(-4)}`,
      remainingCredits: 0
    });
    const token = signToken(user.id);
    return { token, user: userService.toUserInfo(user) };
  },
  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await userRepository.findByPhone(data.phone);
    if (!user) {
      throw new ApiError('手机号或密码错误', 401, 'UNAUTHORIZED');
    }
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      throw new ApiError('手机号或密码错误', 401, 'UNAUTHORIZED');
    }
    const token = signToken(user.id);
    return { token, user: userService.toUserInfo(user) };
  },
  verifyToken(token: string) {
    const secret = getJwtSecret();
    const payload = jwt.verify(token, secret) as { sub: string };
    return payload.sub;
  }
};
