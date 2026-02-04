import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      success: false,
      error: { code: error.code, message: error.message }
    });
    return;
  }
  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      error: { code: 'UNKNOWN', message: error.message }
    });
    return;
  }
  res.status(500).json({
    success: false,
    error: { code: 'UNKNOWN', message: '未知错误' }
  });
}
