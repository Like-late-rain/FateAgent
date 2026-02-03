const DEFAULT_PORT = 3001;
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_FRONTEND_URL = 'http://localhost:3000';
const DEFAULT_JWT_EXPIRES_IN = '7d';
const DEFAULT_AGENT_URL = 'http://localhost:8000';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return secret;
}

export const ENV = {
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  nodeEnv: process.env.NODE_ENV ?? DEFAULT_NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL ?? DEFAULT_FRONTEND_URL,
  jwtSecret: getJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_JWT_EXPIRES_IN,
  agentServiceUrl: process.env.AGENT_SERVICE_URL ?? DEFAULT_AGENT_URL,
  agentApiKey: process.env.AGENT_API_KEY ?? '',
};
