import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

function getCallbackToken() {
  const token = process.env.WECHAT_API_KEY;
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
