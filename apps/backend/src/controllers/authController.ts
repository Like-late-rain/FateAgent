import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { LoginRequest, RegisterRequest } from '@fateagent/shared-types';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants';
import { buildAuthCookie, getUserCredits, getUserProfile, loginUser, registerUser } from '../services/authService';
import { success, failure } from '../utils/response';
import { authenticate } from '../middlewares/authMiddleware';

const registerSchema = z.object({
  phone: z.string().min(5),
  password: z.string().min(6),
  smsCode: z.string().min(4),
});

const loginSchema = z.object({
  phone: z.string().min(5),
  password: z.string().min(6),
});

function handleError(error: unknown, reply: FastifyReply) {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code ?? ERROR_CODES.VALIDATION_ERROR;
    reply.status(400).send(failure(code, error.message));
    return;
  }
  reply.status(500).send(failure(ERROR_CODES.INTERNAL_ERROR, ERROR_MESSAGES.internalError));
}

export async function authRoutes(server: FastifyInstance) {
  server.post('/api/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = registerSchema.parse(request.body) as RegisterRequest;
      const result = await registerUser(body);
      const cookie = buildAuthCookie(result.token);
      reply.setCookie(cookie.name, cookie.value, cookie.options);
      reply.send(success(result));
    } catch (error) {
      handleError(error, reply);
    }
  });

  server.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = loginSchema.parse(request.body) as LoginRequest;
      const result = await loginUser(body);
      const cookie = buildAuthCookie(result.token);
      reply.setCookie(cookie.name, cookie.value, cookie.options);
      reply.send(success(result));
    } catch (error) {
      handleError(error, reply);
    }
  });

  server.get(
    '/api/users/me',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId;
        if (!userId) {
          reply.status(401).send(failure(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.unauthorizedShort));
        return;
      }
      const user = getUserProfile(userId);
      reply.send(success(user));
    } catch (error) {
      handleError(error, reply);
    }
    },
  );

  server.get(
    '/api/users/me/credits',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId;
        if (!userId) {
          reply.status(401).send(failure(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.unauthorizedShort));
        return;
      }
      const credits = getUserCredits(userId);
      reply.send(success(credits));
    } catch (error) {
      handleError(error, reply);
    }
    },
  );
}
