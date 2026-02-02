import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { CreateOrderRequest } from '@fateagent/shared-types';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants';
import { authenticate } from '../middlewares/authMiddleware';
import { createOrder, handleOrderCallback } from '../services/orderService';
import { failure, success } from '../utils/response';

const createOrderSchema = z.object({
  productType: z.enum(['credits_10', 'credits_30', 'credits_100']),
});

const callbackSchema = z.object({
  orderNo: z.string().min(1),
  status: z.enum(['paid', 'failed']),
});

function handleError(error: unknown, reply: FastifyReply) {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code ?? ERROR_CODES.VALIDATION_ERROR;
    reply.status(400).send(failure(code, error.message));
    return;
  }
  reply.status(500).send(failure(ERROR_CODES.INTERNAL_ERROR, ERROR_MESSAGES.internalError));
}

export async function orderRoutes(server: FastifyInstance) {
  server.post(
    '/api/orders',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = createOrderSchema.parse(request.body) as CreateOrderRequest;
        const userId = request.userId;
        if (!userId) {
          reply.status(401).send(failure(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.unauthorizedShort));
          return;
        }
        const order = createOrder(userId, body);
        reply.send(success(order));
      } catch (error) {
        handleError(error, reply);
      }
    },
  );

  server.post('/api/orders/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = callbackSchema.parse(request.body) as { orderNo: string; status: 'paid' | 'failed' };
      const order = handleOrderCallback(body.orderNo, body.status);
      reply.send(success(order));
    } catch (error) {
      handleError(error, reply);
    }
  });
}
