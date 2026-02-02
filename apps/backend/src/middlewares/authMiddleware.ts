import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, ERROR_CODES, ERROR_MESSAGES } from '../constants';
import { ENV } from '../config/env';

export function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies[COOKIE_NAME];
  if (!token || !ENV.jwtSecret) {
    reply.status(401).send({
      success: false,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: ERROR_MESSAGES.unauthorized },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.jwtSecret) as { sub?: string };
    request.userId = decoded.sub;
  } catch (error) {
    reply.status(401).send({
      success: false,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: ERROR_MESSAGES.unauthorized },
    });
  }
}
