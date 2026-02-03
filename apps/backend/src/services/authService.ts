import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import type { AuthResponse, LoginRequest, RegisterRequest, UserInfo } from '@fateagent/shared-types';
import { COOKIE_NAME, ERROR_CODES, ERROR_MESSAGES, USER_NICKNAME_PREFIX } from '../constants';
import { ENV } from '../config/env';
import { createUser, findUserById, findUserByPhone } from '../repositories/userRepository';
import type { UserRecord } from '../models/user';

const PASSWORD_SALT_ROUNDS = 10;

function toUserInfo(user: UserRecord): UserInfo {
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    remainingCredits: user.remainingCredits,
    createdAt: user.createdAt,
  };
}

function signToken(userId: string): string {
  if (!ENV.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ sub: userId }, ENV.jwtSecret, { expiresIn: ENV.jwtExpiresIn });
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const exists = findUserByPhone(payload.phone);
  if (exists) {
    const error = new Error(ERROR_MESSAGES.duplicatePhone);
    (error as { code?: string }).code = ERROR_CODES.DUPLICATE_PHONE;
    throw error;
  }
  const hashed = await bcrypt.hash(payload.password, PASSWORD_SALT_ROUNDS);
  const user = createUser({
    id: randomUUID(),
    phone: payload.phone,
    passwordHash: hashed,
    nickname: `${USER_NICKNAME_PREFIX}${payload.phone.slice(-4)}`,
    createdAt: new Date().toISOString(),
  });
  const token = signToken(user.id);
  return { token, user: toUserInfo(user) };
}

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const user = findUserByPhone(payload.phone);
  if (!user) {
    const error = new Error(ERROR_MESSAGES.invalidCredentials);
    (error as { code?: string }).code = ERROR_CODES.UNAUTHORIZED;
    throw error;
  }
  const isValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValid) {
    const error = new Error(ERROR_MESSAGES.invalidCredentials);
    (error as { code?: string }).code = ERROR_CODES.UNAUTHORIZED;
    throw error;
  }
  const token = signToken(user.id);
  return { token, user: toUserInfo(user) };
}

export function getUserProfile(userId: string): UserInfo {
  const user = findUserById(userId);
  if (!user) {
    const error = new Error(ERROR_MESSAGES.userNotFound);
    (error as { code?: string }).code = ERROR_CODES.NOT_FOUND;
    throw error;
  }
  return toUserInfo(user);
}

export function getUserCredits(userId: string): { remainingCredits: number } {
  const user = findUserById(userId);
  if (!user) {
    const error = new Error(ERROR_MESSAGES.userNotFound);
    (error as { code?: string }).code = ERROR_CODES.NOT_FOUND;
    throw error;
  }
  return { remainingCredits: user.remainingCredits };
}

export function buildAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      path: '/',
      sameSite: 'lax' as const,
      secure: ENV.nodeEnv === 'production',
    },
  };
}
