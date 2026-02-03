import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { AnalysisRequest } from '@fateagent/shared-types';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants';
import { authenticate } from '../middlewares/authMiddleware';
import { createAnalysisRequest, getAnalysis, listAnalysisHistory } from '../services/analysisService';
import { failure, success } from '../utils/response';

const analysisSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  competition: z.string().min(1),
  matchDate: z.string().min(8),
});
const DEFAULT_PAGE = 1;

function handleError(error: unknown, reply: FastifyReply) {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code ?? ERROR_CODES.VALIDATION_ERROR;
    const status = code === ERROR_CODES.INSUFFICIENT_CREDITS ? 403 : code === ERROR_CODES.NOT_FOUND ? 404 : 400;
    reply.status(status).send(failure(code, error.message));
    return;
  }
  reply.status(500).send(failure(ERROR_CODES.INTERNAL_ERROR, ERROR_MESSAGES.internalError));
}

export async function analysisRoutes(server: FastifyInstance) {
  server.post(
    '/api/analysis',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = analysisSchema.parse(request.body) as AnalysisRequest;
        const userId = request.userId;
        if (!userId) {
          reply.status(401).send(failure(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.unauthorizedShort));
          return;
        }
        const result = await createAnalysisRequest(userId, payload);
        reply.send(success(result));
      } catch (error) {
        handleError(error, reply);
      }
    },
  );

  server.get(
    '/api/analysis/:id',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId;
        if (!userId) {
          reply.status(401).send(failure(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.unauthorizedShort));
          return;
        }
        const params = request.params as { id: string };
        const result = await getAnalysis(userId, params.id);
        reply.send(success(result));
      } catch (error) {
        handleError(error, reply);
      }
    },
  );

  server.get(
    '/api/analysis',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId;
        if (!userId) {
          reply.status(401).send(failure(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.unauthorizedShort));
          return;
        }
        const query = request.query as { page?: string; pageSize?: string };
        const page = query.page ? Number(query.page) : DEFAULT_PAGE;
        const pageSize = query.pageSize ? Number(query.pageSize) : undefined;
        const result = await listAnalysisHistory(userId, page, pageSize);
        reply.send(success(result));
      } catch (error) {
        handleError(error, reply);
      }
    },
  );
}
