import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { ENV } from './config/env';
import { authRoutes } from './controllers/authController';
import { orderRoutes } from './controllers/orderController';
import { analysisRoutes } from './controllers/analysisController';

const server = Fastify({ logger: true });
const HOST = '0.0.0.0';
const HEALTH_STATUS = { status: 'ok' } as const;

server.register(cors, {
  origin: ENV.frontendUrl,
  credentials: true,
});

server.register(cookie, {
  secret: ENV.jwtSecret,
});

server.get('/health', async () => HEALTH_STATUS);
server.register(authRoutes);
server.register(orderRoutes);
server.register(analysisRoutes);

const start = async () => {
  try {
    await server.listen({ port: ENV.port, host: HOST });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
