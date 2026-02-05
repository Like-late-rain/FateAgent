import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

const MOCK_CALLBACK_TOKEN = 'mock-callback-token';

function getCallbackToken() {
  const paymentProvider = process.env.PAYMENT_PROVIDER || 'mock';

  // 模拟支付使用固定 token
  if (paymentProvider === 'mock') {
    return MOCK_CALLBACK_TOKEN;
  }

  // 真实支付使用配置的密钥
  const token = process.env.PAYMENT_CALLBACK_TOKEN || process.env.WECHAT_API_KEY;
  if (!token) {
    throw new ApiError('支付回调密钥未配置', 500, 'UNKNOWN');
  }
  return token;
}

export function paymentCallbackAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = getCallbackToken();
    const provided = req.header('x-callback-token');
    if (!provided || provided !== token) {
      throw new ApiError('支付回调鉴权失败', 401, 'UNAUTHORIZED');
    }
    next();
  } catch (error) {
    next(error);
  }
}
