import type { ErrorCode } from '@fateagent/shared-types';

export class ApiError extends Error {
  status: number;
  code: ErrorCode | 'UNKNOWN';

  constructor(message: string, status: number, code: ErrorCode | 'UNKNOWN') {
    super(message);
    this.status = status;
    this.code = code;
  }
}
